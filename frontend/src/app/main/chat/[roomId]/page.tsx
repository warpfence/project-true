"use client";

/**
 * 채팅방 페이지.
 *
 * roomId 파라미터로 채팅방 정보를 로드하고 ChatRoom 컴포넌트를 렌더링한다.
 */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import ChatRoom from "@/components/chat/ChatRoom";
import { getRoomDetail } from "@/services/chatService";
import type { ChatRoomDetailResponse } from "@/types/chat";

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const [roomDetail, setRoomDetail] = useState<ChatRoomDetailResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoom() {
      try {
        setIsLoading(true);
        setError(null);
        const detail = await getRoomDetail(roomId);
        setRoomDetail(detail);
      } catch (err) {
        console.error("채팅방 로드 실패:", err);
        setError("채팅방을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    if (roomId) {
      loadRoom();
    }
  }, [roomId]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="flex justify-start">
            <Skeleton className="h-16 w-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !roomDetail) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500">{error || "채팅방을 찾을 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  return <ChatRoom roomDetail={roomDetail} />;
}
