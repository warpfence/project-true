"use client";

/**
 * 나의 상담 이력 페이지.
 *
 * 채팅방 목록을 표시하고, 클릭 시 해당 채팅방으로 이동한다.
 */
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/common/EmptyState";
import { useChatRooms } from "@/hooks/useChatRooms";

export default function HistoryPage() {
  const router = useRouter();
  const { rooms, isLoading, error } = useChatRooms();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-3">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
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
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        나의 상담 이력
      </h1>

      {rooms.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => {
            return (
              <Card
                key={room.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/main/chat/${room.id}`)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{room.expert_icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {room.expert_name}
                      </span>
                      <Badge
                        variant={
                          room.status === "active" ? "default" : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {room.status === "active" ? "진행 중" : "완료"}
                      </Badge>
                    </div>
                    {room.title && (
                      <p className="text-sm text-gray-700 truncate mt-0.5">
                        {room.title}
                      </p>
                    )}
                    {room.last_message_preview && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {room.last_message_preview}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(room.updated_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
