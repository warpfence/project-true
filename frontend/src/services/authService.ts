/** 인증 관련 API 서비스 */

import { apiGet } from "./api";
import type { User } from "@/types/user";

/** 현재 사용자 정보 조회 */
export async function getMe(): Promise<User> {
  return apiGet<User>("/api/auth/me");
}
