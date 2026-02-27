"use client";

/**
 * TypingIndicator 컴포넌트.
 *
 * AI가 응답을 생성 중일 때 점 3개 바운스 애니메이션을 표시한다.
 */

export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-[message-in_0.3s_ease-out]">
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-[typing-dot_1.4s_ease-in-out_infinite]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-[typing-dot_1.4s_ease-in-out_0.2s_infinite]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-[typing-dot_1.4s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>
    </div>
  );
}
