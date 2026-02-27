"use client";

/**
 * useChatRooms 훅.
 *
 * 채팅방 목록 상태 관리, 로딩/에러 처리를 제공한다.
 */
import { useCallback, useEffect, useState } from "react";
import { getRooms } from "@/services/chatService";
import type { ChatRoomListItem } from "@/types/chat";

interface UseChatRoomsOptions {
  status?: string;
  limit?: number;
}

export function useChatRooms(options?: UseChatRoomsOptions) {
  const [rooms, setRooms] = useState<ChatRoomListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getRooms({
        status: options?.status,
        limit: options?.limit,
      });
      setRooms(data.rooms);
      setTotal(data.total);
    } catch (err) {
      setError("상담 이력을 불러오는 데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [options?.status, options?.limit]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, total, isLoading, error, refetch: fetchRooms };
}
