"use client";

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
        <p className="whitespace-pre-wrap">{content}</p>
        {isStreaming && (
          <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-blue-500" />
        )}
      </div>
    </div>
  );
}
