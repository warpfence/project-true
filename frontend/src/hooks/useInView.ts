"use client";

/**
 * useInView 훅.
 *
 * Intersection Observer로 요소가 뷰포트에 진입했는지 감지한다.
 * 한 번 진입하면 이후 재진입해도 상태가 유지된다 (1회성 트리거).
 * prefers-reduced-motion 설정 시 즉시 visible 처리.
 */
import { useState, useEffect, useRef } from "react";

export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* reduced motion 설정 시 즉시 보이게 처리 */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible] as const;
}
