"use client";

/**
 * SummaryCard 컴포넌트.
 *
 * 상담 요약 카드. 주제, 핵심 조언, 다음 액션 아이템을 표시한다.
 */
import { CheckCircle, Lightbulb, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChatSummary } from "@/types/chat";

interface SummaryCardProps {
  summary: ChatSummary;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card className="border-green-200 bg-green-50/50 mx-4 my-3">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <CardTitle className="text-base">상담 요약</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            완료
          </Badge>
        </div>
        <p className="text-sm font-medium text-gray-800 mt-1">
          {summary.topic}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 핵심 조언 */}
        {summary.key_advice.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-semibold text-gray-600">
                핵심 조언
              </span>
            </div>
            <ul className="space-y-1">
              {summary.key_advice.map((advice, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-700 pl-5 relative before:content-['•'] before:absolute before:left-1.5 before:text-gray-400"
                >
                  {advice}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 다음 액션 아이템 */}
        {summary.action_items.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <ArrowRight className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-semibold text-gray-600">
                다음 행동
              </span>
            </div>
            <ul className="space-y-1">
              {summary.action_items.map((item, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-700 pl-5 relative before:content-['☐'] before:absolute before:left-0.5 before:text-blue-400 before:text-xs"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
