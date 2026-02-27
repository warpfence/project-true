/** 채팅 관련 API 서비스 */

import { apiGet, apiPost, apiPatch, apiPostStream } from "./api";
import type {
  ChatRoom,
  ChatRoomListResponse,
  ChatRoomDetailResponse,
  CreateRoomRequest,
  UpdateRoomRequest,
  SummaryResponse,
} from "@/types/chat";

/** 채팅방 생성 */
export async function createRoom(
  request: CreateRoomRequest,
): Promise<ChatRoom> {
  return apiPost<ChatRoom>("/api/chat/rooms", request);
}

/** 채팅방 목록 조회 */
export async function getRooms(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<ChatRoomListResponse> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));

  const queryStr = query.toString();
  return apiGet<ChatRoomListResponse>(
    `/api/chat/rooms${queryStr ? `?${queryStr}` : ""}`,
  );
}

/** 채팅방 상세 조회 */
export async function getRoomDetail(
  roomId: string,
  params?: { limit?: number; before?: string },
): Promise<ChatRoomDetailResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.before) query.set("before", params.before);

  const queryStr = query.toString();
  return apiGet<ChatRoomDetailResponse>(
    `/api/chat/rooms/${roomId}${queryStr ? `?${queryStr}` : ""}`,
  );
}

/** 메시지 전송 (SSE 스트림 반환) */
export async function sendMessage(
  roomId: string,
  content: string,
): Promise<Response> {
  return apiPostStream(`/api/chat/rooms/${roomId}/messages`, { content });
}

/** 상담 요약 생성 */
export async function createSummary(roomId: string): Promise<SummaryResponse> {
  return apiPost<SummaryResponse>(`/api/chat/rooms/${roomId}/summary`);
}

/** 채팅방 정보 수정 */
export async function updateRoom(
  roomId: string,
  request: UpdateRoomRequest,
): Promise<ChatRoom> {
  return apiPatch<ChatRoom>(`/api/chat/rooms/${roomId}`, request);
}
