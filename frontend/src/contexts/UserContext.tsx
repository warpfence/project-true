"use client";

/**
 * 사용자 정보 Context.
 *
 * 백엔드에서 조회한 사용자 정보를 앱 전역에서 공유한다.
 * 닉네임 수정 등으로 데이터가 바뀌면 refreshUser()를 호출해
 * Header 등 다른 컴포넌트에 즉시 반영한다.
 */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getMe } from "@/services/userService";
import type { User } from "@/types/user";

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  /** 사용자 정보를 백엔드에서 다시 조회한다. */
  refreshUser: () => Promise<void>;
  /** 로컬 상태를 직접 갱신한다 (API 응답값으로 즉시 반영). */
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: true,
  refreshUser: async () => {},
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await getMe();
      setUser(data);
    } catch {
      // API 실패 시 기존 상태 유지
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    refreshUser();
  }, [status, refreshUser]);

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
