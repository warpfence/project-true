"use client";

/**
 * IntroSection 컴포넌트.
 *
 * 서비스 소개 섹션.
 */

export default function IntroSection() {
  const features = [
    {
      icon: "💬",
      title: "실시간 AI 상담",
      description: "전문 AI가 실시간으로 맞춤형 답변을 제공합니다.",
    },
    {
      icon: "🔒",
      title: "안전한 상담",
      description: "개인정보는 안전하게 보호되며, 부담 없이 상담할 수 있습니다.",
    },
    {
      icon: "📋",
      title: "상담 요약",
      description: "상담이 끝나면 핵심 조언과 행동 계획을 정리해 드립니다.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI 전문가에게 부담 없이 상담받아 보세요
        </h2>
        <p className="text-gray-500 mb-12">
          언제든지, 어디서든 편하게 고민을 나눌 수 있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <span className="text-4xl block mb-3">{feature.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
