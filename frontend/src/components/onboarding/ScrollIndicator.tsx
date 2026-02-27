/**
 * ScrollIndicator 컴포넌트.
 *
 * 히어로 섹션 하단 스크롤 가이드. 스크롤 시 사라진다.
 */

interface ScrollIndicatorProps {
  visible: boolean;
  scrollY: number;
}

export default function ScrollIndicator({ visible, scrollY }: ScrollIndicatorProps) {
  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-7 h-11 rounded-[14px] border-2 border-brand-navy/20 flex items-start justify-center pt-2 transition-opacity duration-500"
      style={{ opacity: visible && scrollY < 100 ? 0.6 : 0 }}
    >
      <div className="w-1 h-2.5 rounded-sm bg-brand-navy opacity-40 animate-scroll-bounce" />
    </div>
  );
}
