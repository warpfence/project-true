/** 전문가 관련 타입 정의 */

export type ExpertType = "career" | "love" | "fortune" | "parenting";

export interface Expert {
  id: string;
  expert_type: ExpertType;
  name: string;
  description: string;
  icon: string;
}
