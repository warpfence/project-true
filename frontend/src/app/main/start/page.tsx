"use client";

/**
 * 시작하기 페이지.
 *
 * 전문가 4개 카드 그리드를 표시하고, 선택 시 채팅방을 생성하여
 * /main/chat/[roomId] 로 라우팅한다.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import ExpertCard from "@/components/expert/ExpertCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useExperts } from "@/hooks/useExperts";
import { createRoom } from "@/services/chatService";
import type { Expert } from "@/types/expert";

export default function StartPage() {
  const router = useRouter();
  const { experts, isLoading } = useExperts();
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectExpert = async (expert: Expert) => {
    if (isCreating) return;
    try {
      setIsCreating(true);
      const room = await createRoom({ expert_type: expert.expert_type });
      router.push(`/main/chat/${room.id}`);
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          상담받고 싶은 전문가를 선택해 주세요
        </h1>
        <p className="mt-2 text-gray-500">
          각 분야의 AI 전문가가 맞춤형 상담을 제공합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </div>
            ))
          : experts.map((expert) => (
              <ExpertCard
                key={expert.id}
                expert={expert}
                onClick={handleSelectExpert}
                disabled={isCreating}
              />
            ))}
      </div>
    </div>
  );
}
