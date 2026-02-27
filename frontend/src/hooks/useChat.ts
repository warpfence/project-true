"use client";

/**
 * useChat 훅.
 *
 * fetch + ReadableStream 기반 SSE 파싱으로 AI 응답을 스트리밍 수신한다.
 * AbortController로 요청 취소를 지원하며, 에러/타임아웃을 처리한다.
 */
import { useCallback, useRef, useState } from "react";
import { sendMessage } from "@/services/chatService";
import type { Message } from "@/types/chat";

interface UseChatOptions {
  roomId: string;
  initialMessages?: Message[];
}

interface UseChatReturn {
  messages: Message[];
  isTyping: boolean;
  streamingContent: string;
  error: string | null;
  sendUserMessage: (content: string) => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function useChat({ roomId, initialMessages = [] }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendUserMessage = useCallback(
    async (content: string) => {
      if (isTyping) return;

      setError(null);
      setIsTyping(true);
      setStreamingContent("");

      // 사용자 메시지를 즉시 UI에 추가 (낙관적 업데이트)
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMessage]);

      // AbortController 생성
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // 타임아웃 설정 (60초)
      const timeoutId = setTimeout(() => {
        controller.abort();
        setError("응답 시간이 초과되었습니다. 다시 시도해 주세요.");
        setIsTyping(false);
        setStreamingContent("");
      }, 60_000);

      try {
        const response = await sendMessage(roomId, content);

        if (!response.body) {
          throw new Error("스트리밍 응답을 받을 수 없습니다.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // AbortController 확인
          if (controller.signal.aborted) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE 라인 파싱
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("event:")) {
              // 이벤트 타입 저장
              continue;
            }
            if (line.startsWith("data:")) {
              const dataStr = line.slice(5).trim();
              if (!dataStr) continue;

              try {
                const data = JSON.parse(dataStr);

                if (data.content !== undefined) {
                  // chunk 또는 done 이벤트
                  if (data.content && !data.message) {
                    // chunk 이벤트 - 이전에 event: done인지 확인
                    // SSE에서는 event: chunk → data: {...} 순서
                    fullContent += data.content;
                    setStreamingContent(fullContent);
                  }
                }

                if (data.message !== undefined) {
                  // error 이벤트
                  setError(data.message);
                  setIsTyping(false);
                  setStreamingContent("");
                  clearTimeout(timeoutId);
                  return;
                }
              } catch {
                // JSON 파싱 실패 무시
              }
            }
          }
        }

        // 스트리밍 완료 - AI 메시지를 messages에 추가
        if (fullContent) {
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: fullContent,
            created_at: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }

        setStreamingContent("");
        setIsTyping(false);
      } catch (err) {
        if (controller.signal.aborted) {
          // 타임아웃 또는 수동 취소
          return;
        }
        console.error("메시지 전송 실패:", err);
        setError("메시지 전송에 실패했습니다. 다시 시도해 주세요.");
        setIsTyping(false);
        setStreamingContent("");
      } finally {
        clearTimeout(timeoutId);
        abortControllerRef.current = null;
      }
    },
    [roomId, isTyping],
  );

  return {
    messages,
    isTyping,
    streamingContent,
    error,
    sendUserMessage,
    setMessages,
  };
}
