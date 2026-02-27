"use client";

/**
 * 온보딩 랜딩 페이지.
 *
 * 비로그인 사용자에게 표시되는 첫 화면.
 * HeroSection + IntroSection + CategorySection 구성의 원페이지 스크롤 레이아웃.
 */
import HeroSection from "@/components/onboarding/HeroSection";
import IntroSection from "@/components/onboarding/IntroSection";
import CategorySection from "@/components/onboarding/CategorySection";
import { DISCLAIMER_TEXT } from "@/lib/constants";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <HeroSection />
      <IntroSection />
      <CategorySection />

      {/* 면책 문구 */}
      <footer className="px-4 py-8 border-t">
        <p className="text-center text-xs text-gray-400 max-w-2xl mx-auto">
          {DISCLAIMER_TEXT}
        </p>
      </footer>
    </div>
  );
}
