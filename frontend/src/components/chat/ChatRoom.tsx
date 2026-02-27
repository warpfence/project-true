"use client";

/**
 * ChatRoom 컨테이너 컴포넌트.
 *
 * ChatHeader + MessageList + SummaryCard + DisclaimerBanner + ChatInput을
 * 조합하여 전체 채팅방 UI를 구성한다.
 */
import { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import SummaryCard from "./SummaryCard";
import DisclaimerBanner from "./DisclaimerBanner";
import ChatInput from "./ChatInput";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { createSummary } from "@/services/chatService";
import type { ChatRoomDetailResponse, ChatSummary } from "@/types/chat";

interface ChatRoomProps {
  roomDetail: ChatRoomDetailResponse;
}

export default function ChatRoom({ roomDetail }: ChatRoomProps) {
  const {
    messages,
    isTyping,
    streamingContent,
    error,
    sendUserMessage,
    setMessages,
  } = useChat({
    roomId: roomDetail.id,
    initialMessages: roomDetail.messages,
  });

  const [summary, setSummary] = useState<ChatSummary | null>(
    roomDetail.summary,
  );
  const [roomStatus, setRoomStatus] = useState(roomDetail.status);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // roomDetail 변경 시 동기화
  useEffect(() => {
    setMessages(roomDetail.messages);
    setSummary(roomDetail.summary);
    setRoomStatus(roomDetail.status);
  }, [roomDetail, setMessages]);

  const isCompleted = roomStatus === "completed";

  const handleEndConsultation = async () => {
    if (isSummarizing) return;
    try {
      setIsSummarizing(true);
      const result = await createSummary(roomDetail.id);
      setSummary(result.summary);
      setRoomStatus("completed");
    } catch (err) {
      console.error("요약 생성 실패:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ChatHeader
        expertName={roomDetail.expert_name}
        expertType={roomDetail.expert_type}
        expertIcon={roomDetail.expert_icon}
      />

      <MessageList
        messages={messages}
        isTyping={isTyping}
        streamingContent={streamingContent}
      />

      {/* 요약 카드 */}
      {summary && <SummaryCard summary={summary} />}

      {/* 에러 메시지 */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100">
          <p className="text-xs text-red-600 text-center">{error}</p>
        </div>
      )}

      {!isCompleted && (
        <>
          <DisclaimerBanner />
          <div className="px-4 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs text-gray-500"
              onClick={handleEndConsultation}
              disabled={isTyping || isSummarizing || messages.length < 2}
            >
              {isSummarizing ? "요약 생성 중..." : "상담 종료 및 요약 생성"}
            </Button>
          </div>
          <ChatInput
            onSend={sendUserMessage}
            disabled={isTyping || isSummarizing}
          />
        </>
      )}

      {isCompleted && !summary && (
        <div className="px-4 py-3 bg-gray-100 border-t text-center">
          <p className="text-sm text-gray-500">상담이 완료되었습니다.</p>
        </div>
      )}
    </div>
  );
}
