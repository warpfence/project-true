"use client";

/**
 * LoadingSpinner 컴포넌트.
 *
 * 페이지나 데이터 로딩 시 표시하는 스켈레톤 기반 로딩 표시기.
 */
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSpinnerProps {
  fullPage?: boolean;
}

export default function LoadingSpinner({ fullPage = false }: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-4 w-full max-w-sm">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-[typing-dot_1.4s_ease-in-out_infinite]" />
        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-[typing-dot_1.4s_ease-in-out_0.2s_infinite]" />
        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-[typing-dot_1.4s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  );
}
