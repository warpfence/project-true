"use client";

/**
 * HeroSection 컴포넌트.
 *
 * 온보딩 페이지 최상단 CTA 섹션.
 */
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-6xl mb-6">🤖</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        AI 전문가 상담
      </h1>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        취업, 연애, 사주, 육아 — 4개 분야의 AI 전문가가
        <br />
        당신의 고민에 맞춤형 상담을 제공합니다.
      </p>
      <Button
        size="lg"
        className="text-base px-8 py-3"
        onClick={() => signIn("google", { callbackUrl: "/main/start" })}
      >
        지금 시작하기
      </Button>
    </section>
  );
}
