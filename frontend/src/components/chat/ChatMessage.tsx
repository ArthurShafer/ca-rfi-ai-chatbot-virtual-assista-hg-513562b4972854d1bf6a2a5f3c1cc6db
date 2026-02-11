"use client";

import Markdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({
  role,
  content,
  isStreaming,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
      role="listitem"
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-blue-700 text-white"
            : "rounded-bl-md bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <Markdown
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline decoration-blue-300 hover:text-blue-800 hover:decoration-blue-500"
                >
                  {children}
                </a>
              ),
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              h1: ({ children }) => <p className="mb-1 font-semibold">{children}</p>,
              h2: ({ children }) => <p className="mb-1 font-semibold">{children}</p>,
              h3: ({ children }) => <p className="mb-1 font-semibold">{children}</p>,
            }}
          >
            {content}
          </Markdown>
        )}
        {isStreaming && (
          <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-blue-500" />
        )}
      </div>
    </div>
  );
}
