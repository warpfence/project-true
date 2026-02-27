"use client";

/**
 * ChatHeader 컴포넌트.
 *
 * 채팅방 상단에 뒤로가기 버튼, 전문가 이름, 분야를 표시한다.
 */
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EXPERT_TYPES } from "@/lib/constants";

interface ChatHeaderProps {
  expertName: string;
  expertType: string;
  expertIcon: string;
}

export default function ChatHeader({
  expertName,
  expertType,
  expertIcon,
}: ChatHeaderProps) {
  const router = useRouter();
  const typeInfo = EXPERT_TYPES[expertType as keyof typeof EXPERT_TYPES];

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b bg-white">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        aria-label="뒤로가기"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <span className="text-2xl">{expertIcon}</span>
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold truncate">{expertName}</h2>
        {typeInfo && (
          <Badge variant="secondary" className="text-xs mt-0.5">
            {typeInfo.label}
          </Badge>
        )}
      </div>
    </div>
  );
}
