"use client";

/**
 * ChatInput 컴포넌트.
 *
 * shadcn Textarea + Button으로 구성된 채팅 입력창.
 * Enter 키 전송, 빈 메시지 비활성화, 2000자 제한 Badge 표시.
 */
import { useState, useRef, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmed = message.trim();
  const canSend = trimmed.length > 0 && trimmed.length <= MAX_MESSAGE_LENGTH && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(trimmed);
    setMessage("");
    // textarea 높이 초기화
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // 자동 높이 조절
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="px-4 py-3 bg-white border-t">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            disabled={disabled}
            rows={1}
            className="min-h-[40px] max-h-[120px] resize-none pr-16"
          />
          <div className="absolute right-2 bottom-1.5">
            <Badge
              variant={
                message.length > MAX_MESSAGE_LENGTH ? "destructive" : "secondary"
              }
              className="text-[10px] px-1.5 py-0"
            >
              {message.length}/{MAX_MESSAGE_LENGTH}
            </Badge>
          </div>
        </div>
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="메시지 전송"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
