"use client";

/**
 * 도움말 페이지.
 *
 * 서비스 이용 안내 콘텐츠를 표시한다.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DISCLAIMER_TEXT } from "@/lib/constants";

const FAQ_ITEMS = [
  {
    question: "어떤 상담을 받을 수 있나요?",
    answer:
      "취업(커리어), 연애, 사주(운세), 육아 총 4개 분야의 AI 전문가와 상담할 수 있습니다. 각 전문가는 해당 분야에 특화된 맞춤형 조언을 제공합니다.",
  },
  {
    question: "상담 내용은 저장되나요?",
    answer:
      "네, 모든 상담 내용은 '나의 상담 이력'에 저장됩니다. 이전 상담을 이어서 진행하거나, 상담 요약을 다시 확인할 수 있습니다.",
  },
  {
    question: "상담 요약은 어떻게 받나요?",
    answer:
      "채팅 중 '상담 종료 및 요약 생성' 버튼을 누르면, AI가 대화 내용을 분석하여 핵심 조언과 다음 행동 아이템을 정리해 드립니다.",
  },
  {
    question: "개인정보는 안전한가요?",
    answer:
      "Google 계정으로 안전하게 로그인하며, 상담 내용은 암호화되어 저장됩니다. 개인정보는 서비스 운영 목적 외에 사용되지 않습니다.",
  },
  {
    question: "AI 상담의 한계는 무엇인가요?",
    answer:
      "AI 전문가는 참고용 조언을 제공하며, 전문 상담사를 대체하지 않습니다. 심각한 문제나 긴급 상황은 반드시 전문 기관에 문의해 주세요.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">도움말</h1>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">서비스 이용 안내</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>
              1. <strong>전문가 선택</strong>: &lsquo;새 상담 시작&rsquo; 메뉴에서 4개
              분야 중 원하는 전문가를 선택하세요.
            </p>
            <p>
              2. <strong>상담 진행</strong>: 채팅창에서 고민을 자유롭게
              이야기하세요. AI 전문가가 실시간으로 답변합니다.
            </p>
            <p>
              3. <strong>상담 종료</strong>: 상담이 충분히 진행되면 &lsquo;상담 종료
              및 요약 생성&rsquo; 버튼으로 요약을 받으세요.
            </p>
            <p>
              4. <strong>이력 확인</strong>: &lsquo;나의 상담 이력&rsquo;에서 이전 상담을
              확인하거나 이어서 진행할 수 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">자주 묻는 질문</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  Q. {item.question}
                </h3>
                <p className="text-sm text-gray-600">{item.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="py-4">
          <p className="text-xs text-gray-400 text-center">
            {DISCLAIMER_TEXT}
          </p>
        </div>
      </div>
    </div>
  );
}
