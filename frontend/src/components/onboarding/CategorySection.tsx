"use client";

/**
 * CategorySection 컴포넌트.
 *
 * 4개 상담 분야 그라데이션 카드 섹션.
 */
import { useInView } from "@/hooks/useInView";
import { EXPERT_TYPES } from "@/lib/constants";

export default function CategorySection() {
  const [cardsRef, cardsVisible] = useInView(0.08);

  const categories = Object.entries(EXPERT_TYPES).map(([key, value]) => ({
    type: key,
    ...value,
  }));

  return (
    <section
      ref={cardsRef as React.RefObject<HTMLElement>}
      className="py-20 px-6"
      style={{ background: "#F7F3ED" }}
    >
      <div className="max-w-[900px] mx-auto text-center pb-20">
        {/* 섹션 태그 */}
        <span
          className="inline-block text-[13px] font-semibold text-brand-blue bg-brand-blue/[0.08] px-4 py-1.5 rounded-full tracking-wide mb-5 onboarding-fade-in"
          style={{
            opacity: cardsVisible ? 1 : 0,
            transform: cardsVisible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          상담 분야
        </span>

        <h2
          className="text-[clamp(24px,4vw,36px)] font-extrabold leading-[1.4] tracking-tight mb-10 text-brand-navy onboarding-fade-in"
          style={{
            opacity: cardsVisible ? 1 : 0,
            transform: cardsVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          어떤 고민이든, 맞는 전문가가 있어요
        </h2>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
          {categories.map((cat, i) => (
            <div
              key={cat.type}
              className="rounded-[22px] px-6 pt-8 pb-7 text-left cursor-default border border-white/60 onboarding-fade-in transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)]"
              style={{
                background: `linear-gradient(135deg, ${cat.bgFrom} 0%, ${cat.bgTo} 100%)`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${0.15 + i * 0.1}s`,
              }}
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3
                className="text-lg font-bold mb-2 tracking-tight"
                style={{ color: cat.colorHex }}
              >
                {cat.title}
              </h3>
              <p className="text-sm text-[#5C6B7E] leading-relaxed m-0">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
