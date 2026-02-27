/** 채팅방 관련 타입 정의 */

import type { ExpertType } from "./expert";

export interface ChatRoom {
  id: string;
  user_id: string;
  expert_id: string;
  expert_name: string;
  expert_type: ExpertType;
  expert_icon: string;
  title: string | null;
  status: "active" | "completed";
  summary: ChatSummary | null;
  created_at: string;
  updated_at: string;
}

export interface ChatSummary {
  topic: string;
  key_advice: string[];
  action_items: string[];
}

export interface ChatRoomListResponse {
  rooms: ChatRoomListItem[];
  total: number;
}

export interface ChatRoomListItem {
  id: string;
  expert_name: string;
  expert_type: ExpertType;
  expert_icon: string;
  title: string | null;
  status: "active" | "completed";
  last_message_preview: string | null;
  updated_at: string;
}

export interface ChatRoomDetailResponse {
  id: string;
  expert_name: string;
  expert_type: ExpertType;
  expert_icon: string;
  title: string | null;
  status: "active" | "completed";
  summary: ChatSummary | null;
  messages: Message[];
  has_more: boolean;
}

export interface CreateRoomRequest {
  expert_type: ExpertType;
}

export interface UpdateRoomRequest {
  title?: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

/** SSE 이벤트 데이터 타입 */
export interface SSEChunkEvent {
  type: "chunk";
  content: string;
}

export interface SSEDoneEvent {
  type: "done";
  message_id: string;
  full_content: string;
}

export interface SSEErrorEvent {
  type: "error";
  message: string;
}

export type SSEEvent = SSEChunkEvent | SSEDoneEvent | SSEErrorEvent;

export interface SummaryResponse {
  room_id: string;
  title: string;
  summary: ChatSummary;
  status: string;
}
