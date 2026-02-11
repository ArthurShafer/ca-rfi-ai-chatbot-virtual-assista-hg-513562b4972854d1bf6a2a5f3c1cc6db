"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import DepartmentBadge from "./DepartmentBadge";
import EscalationPanel from "./EscalationPanel";
import TypingIndicator from "./TypingIndicator";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function ChatWidget() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [showEscalation, setShowEscalation] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(
    (instant?: boolean) => {
      const container = scrollContainerRef.current;
      if (container) {
        if (instant) {
          container.scrollTop = container.scrollHeight;
        } else {
          chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    []
  );

  // During streaming, snap to bottom instantly on every chunk.
  // On non-streaming updates (user sends message), smooth scroll.
  useEffect(() => {
    scrollToBottom(isStreaming);
  }, [messages, scrollToBottom, isStreaming]);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMessage: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);

      try {
        const res = await fetch(`${basePath}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            conversation_id: conversationId,
            language,
          }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let assistantContent = "";
        let buffer = "";

        // Add empty assistant message to stream into
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();

            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);

              // Metadata event (first event)
              if (parsed.conversation_id) {
                setConversationId(parsed.conversation_id);
                if (parsed.department) {
                  const dept = parsed.department;
                  setDepartment(
                    typeof dept === "string" ? dept : dept.name || dept.slug
                  );
                }
                continue;
              }

              // Text chunk event
              if (parsed.text) {
                assistantContent += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // Non-JSON data — treat as plain text
              assistantContent += data;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          }
        }
      } catch (error) {
        const errorMsg =
          language === "es"
            ? "Lo siento, ocurri\u00f3 un error. Por favor intente de nuevo."
            : "Sorry, an error occurred. Please try again.";
        setMessages((prev) => {
          // If last message is empty assistant, replace it
          if (
            prev.length > 0 &&
            prev[prev.length - 1].role === "assistant" &&
            !prev[prev.length - 1].content
          ) {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: errorMsg,
            };
            return updated;
          }
          return [...prev, { role: "assistant", content: errorMsg }];
        });
        console.error("Chat error:", error);
      } finally {
        setIsStreaming(false);
      }
    },
    [conversationId, language]
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Department Badge */}
      {department && <DepartmentBadge name={department} />}

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="chat-scroll min-h-0 flex-1 px-2 py-4"
        role="list"
        aria-label="Chat messages"
      >
        {!hasMessages && <SuggestedQuestions onSelect={sendMessage} />}

        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            role={msg.role}
            content={msg.content}
            isStreaming={
              isStreaming &&
              i === messages.length - 1 &&
              msg.role === "assistant"
            }
          />
        ))}

        {isStreaming &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && (
            <TypingIndicator />
          )}

        <div ref={chatEndRef} />
      </div>

      {/* Escalation Panel */}
      {showEscalation && (
        <div className="px-2 pb-2">
          <EscalationPanel onClose={() => setShowEscalation(false)} />
        </div>
      )}

      {/* Talk to Person + Input */}
      <div>
        {hasMessages && !showEscalation && (
          <div className="flex justify-center pb-1">
            <button
              onClick={() => setShowEscalation(true)}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
            >
              {t("talkToPerson")}
            </button>
          </div>
        )}
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
}
