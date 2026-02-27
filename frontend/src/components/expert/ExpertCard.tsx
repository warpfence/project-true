"use client";

/**
 * ExpertCard 컴포넌트.
 *
 * shadcn Card 기반의 전문가 선택 카드.
 * 아이콘, 이름, 설명, 호버 효과를 포함하며 클릭 시 채팅방을 생성한다.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Expert } from "@/types/expert";

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
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={() => !disabled && onClick(expert)}
    >
      <CardHeader className="text-center pb-2">
        <span className="text-5xl">{expert.icon}</span>
        <CardTitle className="mt-2 text-lg">{expert.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          {expert.description}
        </p>
      </CardContent>
    </Card>
  );
}
