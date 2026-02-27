"use client";

/**
 * HeroSection 컴포넌트.
 *
 * 풀스크린 히어로 CTA 섹션.
 * 패럴랙스 블롭, SVG 로고, 스크롤 인디케이터 포함.
 */
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useInView } from "@/hooks/useInView";
import ScrollIndicator from "@/components/onboarding/ScrollIndicator";

interface HeroSectionProps {
  scrollY: number;
}

export default function HeroSection({ scrollY }: HeroSectionProps) {
  const [heroRef, heroVisible] = useInView(0.1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  /* 패럴랙스는 reduced-motion 설정 시 비활성화 */
  const parallax = reducedMotion ? 0 : scrollY;

  return (
    <section
      ref={heroRef as React.RefObject<HTMLElement>}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20 pb-16"
    >
      {/* 패럴랙스 블롭 */}
      <div
        className="absolute rounded-full pointer-events-none opacity-40"
        style={{
          width: 420,
          height: 420,
          background: "radial-gradient(circle, #F5E6C8 0%, transparent 70%)",
          filter: "blur(80px)",
          top: "-5%",
          right: "-8%",
          transform: `translate(${parallax * 0.03}px, ${parallax * -0.02}px)`,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none opacity-40"
        style={{
          width: 350,
          height: 350,
          background: "radial-gradient(circle, #D4DEF0 0%, transparent 70%)",
          filter: "blur(80px)",
          bottom: "5%",
          left: "-5%",
          transform: `translate(${parallax * -0.02}px, ${parallax * 0.03}px)`,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none opacity-40"
        style={{
          width: 250,
          height: 250,
          background: "radial-gradient(circle, #F2D4DA 0%, transparent 70%)",
          filter: "blur(80px)",
          top: "40%",
          right: "20%",
          transform: `translate(${parallax * 0.015}px, ${parallax * 0.015}px)`,
        }}
      />

      {/* 히어로 콘텐츠 */}
      <div
        className="text-center relative z-10 onboarding-fade-in"
        style={{
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(32px)",
        }}
      >
        {/* 로고 아이콘 (큰 사이즈) */}
        <div className="mb-8 inline-block drop-shadow-[0_8px_24px_rgba(43,58,85,0.15)]">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="36" fill="#2B3A55" />
            <path
              d="M22 28C22 24.69 24.69 22 28 22H44C47.31 22 50 24.69 50 28V38C50 41.31 47.31 44 44 44H39L30 52V44H28C24.69 44 22 41.31 22 38V28Z"
              fill="#F5E6C8"
            />
            <circle cx="32" cy="33" r="2.5" fill="#2B3A55" />
            <circle cx="40" cy="33" r="2.5" fill="#2B3A55" />
          </svg>
        </div>

        <h1 className="text-[clamp(28px,5vw,48px)] font-extrabold leading-[1.35] tracking-tight mb-4 text-brand-navy">
          마음이 복잡할 땐,
          <br />
          <span className="bg-gradient-to-br from-brand-blue to-brand-purple bg-clip-text text-transparent">
            AI 전문가
          </span>
          에게 물어보세요
        </h1>

        <p className="text-[clamp(16px,2.5vw,20px)] text-[#6B7A8D] mb-10 font-normal leading-relaxed">
          24시간, 부담 없이, 나만의 전문 상담사
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/main/start" })}
          className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white rounded-full cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(43,58,85,0.25)]"
          style={{
            background: "linear-gradient(135deg, #2B3A55 0%, #3D5278 100%)",
            boxShadow: "0 4px 20px rgba(43,58,85,0.18)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="mr-2.5"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 1C5.03 1 1 4.13 1 8C1 10.39 2.56 12.5 5 13.74V17L8.28 14.73C8.84 14.82 9.41 14.87 10 14.87C14.97 14.87 19 11.74 19 7.87C19 4.13 14.97 1 10 1Z"
              fill="white"
            />
            <path
              d="M6.5 7H13.5"
              stroke="#2B3A55"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M6.5 10H11"
              stroke="#2B3A55"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          지금 시작하기
        </button>

        <p className="mt-4 text-sm text-[#9AA5B4]">
          Google 계정으로 3초 만에 시작
        </p>
      </div>

      {/* 스크롤 인디케이터 */}
      <ScrollIndicator visible={heroVisible} scrollY={scrollY} />
    </section>
  );
}
