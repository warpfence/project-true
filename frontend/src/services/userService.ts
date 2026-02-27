/** 사용자 관련 API 서비스 */

import { apiGet, apiPatch } from "./api";
import type { User, UpdateUserRequest } from "@/types/user";

/** 내 정보 조회 */
export async function getMe(): Promise<User> {
  return apiGet<User>("/api/users/me");
}

/** 프로필 수정 */
export async function updateProfile(
  request: UpdateUserRequest,
): Promise<User> {
  return apiPatch<User>("/api/users/me", request);
}
