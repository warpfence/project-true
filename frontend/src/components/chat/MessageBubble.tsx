"use client";

/**
 * MessageBubble 컴포넌트.
 *
 * 사용자 메시지는 오른쪽 파란 배경, AI 메시지는 왼쪽 흰 배경으로 표시한다.
 */

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function MessageBubble({
  role,
  content,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-[message-in_0.3s_ease-out]`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
        } ${isStreaming ? "animate-pulse" : ""}`}
      >
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}
