"use client";

/**
 * useScrollPosition 훅.
 *
 * 현재 window.scrollY 값을 반환한다.
 * passive listener 사용으로 스크롤 성능에 영향을 주지 않는다.
 * 스크롤 위치는 기능적 동작(요소 숨김 등)에 사용되므로
 * prefers-reduced-motion과 무관하게 항상 추적한다.
 */
import { useState, useEffect } from "react";

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrollY;
}
