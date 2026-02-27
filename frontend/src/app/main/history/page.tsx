"use client";

/**
 * 나의 상담 이력 페이지.
 *
 * 채팅방 목록을 표시하고, 클릭 시 해당 채팅방으로 이동한다.
 * 더보기 메뉴를 통해 상담 이력을 삭제할 수 있다.
 */
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";
import HistoryRoomCard from "@/components/chat/HistoryRoomCard";
import { useChatRooms } from "@/hooks/useChatRooms";
import { deleteRoom } from "@/services/chatService";

export default function HistoryPage() {
  const { rooms, isLoading, error, refetch } = useChatRooms();

  const handleDelete = async (roomId: string) => {
    await deleteRoom(roomId);
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-3">
        <h1
          className="text-2xl font-semibold mb-6 text-brand-navy"
        >
          나의 상담 이력
        </h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p style={{ color: "#6B7A8D" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1
        className="text-2xl font-semibold mb-6 text-brand-navy"
      >
        나의 상담 이력
      </h1>

      {rooms.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => (
            <HistoryRoomCard
              key={room.id}
              room={room}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
