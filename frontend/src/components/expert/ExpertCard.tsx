"use client";

/**
 * ExpertCard 컴포넌트.
 *
 * 온보딩 CategorySection과 동일한 그라데이션 카드 스타일.
 * 아이콘, 이름, 설명, 호버 효과를 포함하며 클릭 시 채팅방을 생성한다.
 */
import { EXPERT_TYPES } from "@/lib/constants";
import type { Expert } from "@/types/expert";
import type { ExpertType } from "@/types/expert";

interface ExpertCardProps {
  expert: Expert;
  onClick: (expert: Expert) => void;
  disabled?: boolean;
}

export default function ExpertCard({
  expert,
  onClick,
  disabled = false,
}: ExpertCardProps) {
  const meta = EXPERT_TYPES[expert.expert_type as ExpertType];

  return (
    <div
      className={`rounded-[22px] px-6 pt-8 pb-7 text-left border border-white/60 transition-all duration-300 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)]"
      }`}
      style={{
        background: meta
          ? `linear-gradient(135deg, ${meta.bgFrom} 0%, ${meta.bgTo} 100%)`
          : "#F7F3ED",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
      onClick={() => !disabled && onClick(expert)}
    >
      <div className="text-4xl mb-4">{expert.icon}</div>
      <h3
        className="text-lg font-bold mb-2 tracking-tight"
        style={{ color: meta?.colorHex || "#2B3A55" }}
      >
        {expert.name}
      </h3>
      <p className="text-sm text-[#5C6B7E] leading-relaxed m-0">
        {expert.description}
      </p>
    </div>
  );
}
