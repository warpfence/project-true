/** 전문가 관련 API 서비스 */

import { apiGet } from "./api";
import type { Expert, ExpertType } from "@/types/expert";

/** 전문가 목록 조회 */
export async function getExperts(): Promise<Expert[]> {
  return apiGet<Expert[]>("/api/experts");
}

/** 특정 전문가 조회 */
export async function getExpertByType(
  expertType: ExpertType,
): Promise<Expert> {
  return apiGet<Expert>(`/api/experts/${expertType}`);
}
