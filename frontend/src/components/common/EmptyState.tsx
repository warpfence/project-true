"use client";

/**
 * EmptyState 컴포넌트.
 *
 * 데이터가 없을 때 안내 메시지와 액션 버튼을 표시한다.
 */
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = "상담 이력이 없습니다",
  description = "AI 전문가와 첫 상담을 시작해 보세요.",
  actionLabel = "새 상담 시작하기",
  actionHref = "/main/start",
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <MessageCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 text-center">{description}</p>
      <Button onClick={() => router.push(actionHref)}>{actionLabel}</Button>
    </div>
  );
}
