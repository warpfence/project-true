"use client";

/**
 * OnboardingNav 컴포넌트.
 *
 * 스크롤에 따라 배경이 변하는 Floating Navigation.
 */
import TrueLogo from "@/components/icons/TrueLogo";

interface OnboardingNavProps {
  scrollY: number;
}

export default function OnboardingNav({ scrollY }: OnboardingNavProps) {
  const isScrolled = scrollY > 60;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300"
      style={{
        background: isScrolled ? "rgba(253,250,245,0.92)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        boxShadow: isScrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="max-w-[1080px] mx-auto h-16 flex items-center">
        <div className="flex items-center gap-2.5">
          <TrueLogo size={28} />
          <span className="text-lg font-bold tracking-tight text-brand-navy">
            TRUE
          </span>
        </div>
      </div>
    </nav>
  );
}
