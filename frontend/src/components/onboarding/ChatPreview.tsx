/**
 * ChatPreview 컴포넌트.
 *
 * AI 전문가와의 채팅 미리보기 목업 UI.
 */
import { CHAT_PREVIEW_MESSAGES } from "@/lib/constants";

export default function ChatPreview() {
  return (
    <div
      className="max-w-[400px] mx-auto rounded-3xl overflow-hidden border border-brand-navy/[0.06]"
      style={{
        boxShadow:
          "0 4px 32px rgba(43,58,85,0.08), 0 1px 4px rgba(43,58,85,0.04)",
      }}
    >
      {/* 채팅 헤더 */}
      <div
        className="flex items-center gap-3 px-5 py-4 text-white"
        style={{
          background: "linear-gradient(135deg, #2B3A55, #3D5278)",
        }}
      >
        <div className="w-[38px] h-[38px] rounded-xl bg-white/15 flex items-center justify-center text-xl">
          🤖
        </div>
        <div>
          <div className="font-bold text-[15px]">AI 취업 코치</div>
          <div className="text-xs mt-0.5 text-[#8FE5A2] opacity-70">
            ● 항상 온라인
          </div>
        </div>
      </div>

      {/* 채팅 본문 */}
      <div className="p-4 flex flex-col gap-3 bg-white">
        {CHAT_PREVIEW_MESSAGES.map((msg, i) =>
          msg.role === "ai" ? (
            <div
              key={i}
              className="self-start bg-[#F3F1EC] px-4 py-3 rounded-[4px_18px_18px_18px] text-sm leading-relaxed max-w-[85%] text-brand-navy"
            >
              {msg.content}
            </div>
          ) : (
            <div
              key={i}
              className="self-end px-4 py-3 rounded-[18px_4px_18px_18px] text-sm leading-relaxed max-w-[85%] text-white"
              style={{
                background: "linear-gradient(135deg, #4A6FA5, #5A7FB5)",
              }}
            >
              {msg.content}
            </div>
          )
        )}
      </div>
    </div>
  );
}
