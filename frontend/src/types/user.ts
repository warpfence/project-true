/** 사용자 관련 타입 정의 */

export interface User {
  id: string;
  email: string;
  nickname: string;
  profile_image_url: string | null;
  subscription_type: "free" | "premium";
  created_at: string;
  updated_at?: string;
}

export interface UpdateUserRequest {
  nickname?: string;
}
