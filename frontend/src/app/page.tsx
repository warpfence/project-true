"use client";

/**
 * 온보딩 랜딩 페이지.
 *
 * 비로그인 사용자에게 표시되는 첫 화면.
 * OnboardingNav + HeroSection + IntroSection + CategorySection + OnboardingFooter.
 * 크림 톤 배경, 스크롤 인터랙션, 진입 애니메이션 적용.
 */
import { useScrollPosition } from "@/hooks/useScrollPosition";
import OnboardingNav from "@/components/onboarding/OnboardingNav";
import HeroSection from "@/components/onboarding/HeroSection";
import IntroSection from "@/components/onboarding/IntroSection";
import CategorySection from "@/components/onboarding/CategorySection";
import OnboardingFooter from "@/components/onboarding/OnboardingFooter";

export default function OnboardingPage() {
  const scrollY = useScrollPosition();

  return (
    <div
      className="min-h-screen overflow-x-hidden antialiased"
      style={{
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#2B3A55",
        background: "#FDFAF5",
      }}
    >
      <OnboardingNav scrollY={scrollY} />
      <HeroSection scrollY={scrollY} />
      <IntroSection />
      <CategorySection />
      <OnboardingFooter />
    </div>
  );
}
