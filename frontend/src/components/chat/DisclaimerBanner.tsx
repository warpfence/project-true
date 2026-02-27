"use client";

/**
 * DisclaimerBanner 컴포넌트.
 *
 * 채팅 입력창 위에 면책 문구를 표시한다.
 */
import { DISCLAIMER_TEXT } from "@/lib/constants";

export default function DisclaimerBanner() {
  return (
    <div className="px-4 py-1.5 bg-amber-50 border-t border-amber-100">
      <p className="text-[11px] text-amber-700 text-center leading-tight">
        {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}
