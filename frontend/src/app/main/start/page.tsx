"use client";

/**
 * 시작하기 페이지.
 *
 * 전문가 4개 그라데이션 카드 그리드를 표시하고, 선택 시 채팅방을 생성하여
 * /main/chat/[roomId] 로 라우팅한다.
 * 온보딩 페이지와 동일한 크림 톤 테마를 적용한다.
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
    <div className="max-w-[900px] mx-auto">
      <div className="text-center mb-10">
        <span className="inline-block text-[13px] font-semibold text-brand-blue bg-brand-blue/[0.08] px-4 py-1.5 rounded-full tracking-wide mb-5">
          새 상담 시작
        </span>
        <h1 className="text-[clamp(22px,3.5vw,32px)] font-extrabold leading-[1.4] tracking-tight mb-3 text-brand-navy">
          어떤 고민이든, 맞는 전문가가 있어요
        </h1>
        <p className="text-[#6B7A8D] text-base">
          각 분야의 AI 전문가가 맞춤형 상담을 제공합니다.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton
                  className="h-[180px] w-full rounded-[22px]"
                  style={{ background: "rgba(43,58,85,0.06)" }}
                />
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
