"use client";

/** 전문가 목록 관리 훅 */
import { useCallback, useEffect, useState } from "react";
import { getExperts } from "@/services/expertService";
import type { Expert } from "@/types/expert";

export function useExperts() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getExperts();
      setExperts(data);
    } catch (err) {
      setError("전문가 목록을 불러오는 데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  return { experts, isLoading, error, refetch: fetchExperts };
}
