/**
 * OnboardingFooter 컴포넌트.
 *
 * 브랜드 로고, 면책 문구, 저작권 정보를 표시하는 Footer.
 */
import { DISCLAIMER_TEXT } from "@/lib/constants";

export default function OnboardingFooter() {
  return (
    <footer
      className="border-t border-brand-navy/[0.08] px-6 py-8"
      style={{ background: "#F3EFE8" }}
    >
      <div className="max-w-[900px] mx-auto text-center">
        {/* 브랜드 로고 */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#2B3A55" opacity="0.15" />
            <path
              d="M9 11.5C9 10.12 10.12 9 11.5 9H16.5C17.88 9 19 10.12 19 11.5V14.5C19 15.88 17.88 17 16.5 17H15L12 20V17H11.5C10.12 17 9 15.88 9 14.5V11.5Z"
              fill="#2B3A55"
              opacity="0.3"
            />
          </svg>
          <span className="text-sm font-semibold text-brand-navy opacity-50">
            TRUE
          </span>
        </div>

        {/* 면책 문구 */}
        <p className="text-[13px] text-[#8D7B6A] bg-[#8D7B6A]/[0.08] inline-block px-5 py-2 rounded-xl mb-3 leading-normal">
          ⚠️ {DISCLAIMER_TEXT}
        </p>

        {/* 저작권 */}
        <p className="text-xs text-[#A09080] m-0">
          &copy; 2026 TRUE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
