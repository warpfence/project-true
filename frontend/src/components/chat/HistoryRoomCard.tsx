"use client";

/**
 * 상담 이력 카드 컴포넌트.
 *
 * 채팅방 정보를 표시하며, 더보기 메뉴를 통해 삭제 기능을 제공한다.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ChatRoomListItem } from "@/types/chat";

interface HistoryRoomCardProps {
  room: ChatRoomListItem;
  onDelete: (roomId: string) => Promise<void>;
}

export default function HistoryRoomCard({
  room,
  onDelete,
}: HistoryRoomCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(room.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card
        className="p-4 cursor-pointer transition-shadow border-brand-navy/[0.06] hover:shadow-md"
        style={{ backgroundColor: "white" }}
        onClick={() => router.push(`/main/chat/${room.id}`)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{room.expert_icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-brand-navy">
                {room.expert_name}
              </span>
              <Badge
                variant={room.status === "active" ? "default" : "secondary"}
                className="text-[10px]"
              >
                {room.status === "active" ? "진행 중" : "완료"}
              </Badge>
            </div>
            {room.title && (
              <p className="text-sm truncate mt-0.5" style={{ color: "#5C6B7E" }}>
                {room.title}
              </p>
            )}
            {room.last_message_preview && (
              <p className="text-xs truncate mt-0.5" style={{ color: "#9AA5B4" }}>
                {room.last_message_preview}
              </p>
            )}
          </div>
          <span className="text-xs whitespace-nowrap" style={{ color: "#9AA5B4" }}>
            {new Date(room.updated_at).toLocaleDateString("ko-KR")}
          </span>

          {/* 더보기 메뉴 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1.5 rounded-md hover:bg-brand-navy/[0.06] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4 text-brand-navy/40" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent
          className="border-brand-navy/[0.08]"
          style={{ backgroundColor: "#FDFAF5" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-brand-navy">
              상담 이력을 삭제하시겠습니까?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "#6B7A8D" }}>
              삭제된 상담 이력은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-brand-navy/[0.08] text-brand-navy hover:bg-brand-navy/[0.04]"
              disabled={isDeleting}
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
