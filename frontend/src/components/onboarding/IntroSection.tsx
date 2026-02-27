"use client";

/**
 * IntroSection 컴포넌트.
 *
 * 서비스 소개 섹션: 3단계 스텝 카드 + 채팅 미리보기.
 */
import { useInView } from "@/hooks/useInView";
import { ONBOARDING_STEPS } from "@/lib/constants";
import ChatPreview from "@/components/onboarding/ChatPreview";

export default function IntroSection() {
  const [introRef, introVisible] = useInView();

  return (
    <section
      ref={introRef as React.RefObject<HTMLElement>}
      className="py-24 px-6"
      style={{
        background: "linear-gradient(180deg, #FDFAF5 0%, #F7F3ED 100%)",
      }}
    >
      <div
        className="max-w-[860px] mx-auto text-center onboarding-fade-in"
        style={{
          opacity: introVisible ? 1 : 0,
          transform: introVisible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        {/* 섹션 태그 */}
        <span className="inline-block text-[13px] font-semibold text-brand-blue bg-brand-blue/[0.08] px-4 py-1.5 rounded-full tracking-wide mb-5">
          서비스 소개
        </span>

        <h2 className="text-[clamp(24px,4vw,38px)] font-extrabold leading-[1.4] tracking-tight mb-4 text-brand-navy">
          AI 전문가에게 부담 없이
          <br />
          상담받아 보세요
        </h2>

        <p className="text-[clamp(15px,2vw,18px)] text-[#6B7A8D] leading-relaxed mb-12">
          카톡처럼 편하게, 전문가처럼 깊게.
          <br />
          복잡한 예약도, 비싼 상담료도 필요 없어요.
        </p>

        {/* 3단계 스텝 */}
        <div className="flex justify-center gap-5 mb-14 flex-wrap">
          {ONBOARDING_STEPS.map((step, i) => (
            <div
              key={step.num}
              className="relative bg-white/70 backdrop-blur-sm rounded-[20px] px-6 py-7 flex-1 min-w-[200px] max-w-[240px] border border-brand-navy/[0.06] onboarding-fade-in"
              style={{
                opacity: introVisible ? 1 : 0,
                transform: introVisible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${0.2 + i * 0.15}s`,
              }}
            >
              {/* 번호 원형 */}
              <div
                className="w-9 h-9 rounded-full text-white flex items-center justify-center text-[15px] font-bold mx-auto mb-3.5"
                style={{
                  background: "linear-gradient(135deg, #2B3A55, #4A6FA5)",
                }}
              >
                {step.num}
              </div>
              <h3 className="text-base font-bold mb-1.5 text-brand-navy">
                {step.title}
              </h3>
              <p className="text-sm text-[#7D8A9A] leading-normal m-0">
                {step.desc}
              </p>

              {/* 화살표 (마지막 카드 제외) */}
              {i < ONBOARDING_STEPS.length - 1 && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-lg text-[#B0BAC5] font-light hidden md:block">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 채팅 미리보기 */}
        <div
          className="onboarding-fade-in"
          style={{
            opacity: introVisible ? 1 : 0,
            transform: introVisible
              ? "translateY(0) scale(1)"
              : "translateY(20px) scale(0.97)",
            transitionDelay: "0.5s",
          }}
        >
          <ChatPreview />
        </div>
      </div>
    </section>
  );
}
