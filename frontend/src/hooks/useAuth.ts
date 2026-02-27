"use client";

/**
 * 인증 상태 관리 훅.
 *
 * NextAuth useSession과 결합하여 세션 상태 및 로그인/로그아웃을 관리한다.
 */
import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const login = useCallback(() => {
    signIn("google");
  }, []);

  const logout = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return {
    session,
    isLoading,
    isAuthenticated,
    accessToken: session?.accessToken ?? null,
    login,
    logout,
  };
}
