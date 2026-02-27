"use client";

/**
 * MessageList 컴포넌트.
 *
 * shadcn ScrollArea 기반 메시지 목록.
 * 스마트 자동 스크롤: 사용자가 하단에 있을 때만 자동 스크롤.
 */
import { useEffect, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import type { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  streamingContent?: string;
}

export default function MessageList({
  messages,
  isTyping,
  streamingContent,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const checkIsNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const threshold = 100;
    isNearBottomRef.current =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  const scrollToBottom = useCallback(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // 메시지 변경 시 자동 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, isTyping, scrollToBottom]);

  return (
    <ScrollArea className="flex-1">
      <div
        ref={scrollContainerRef}
        className="flex flex-col gap-3 p-4 min-h-full"
        onScroll={checkIsNearBottom}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role as "user" | "assistant"}
            content={msg.content}
          />
        ))}

        {/* 스트리밍 중인 AI 응답 */}
        {streamingContent && (
          <MessageBubble
            role="assistant"
            content={streamingContent}
            isStreaming
          />
        )}

        {/* 타이핑 인디케이터 (스트리밍 시작 전) */}
        {isTyping && !streamingContent && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
