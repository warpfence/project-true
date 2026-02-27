"use client";

/**
 * SessionProvider 래퍼.
 *
 * NextAuth SessionProvider를 제공하여 클라이언트 컴포넌트에서
 * useSession 훅을 사용할 수 있도록 한다.
 */
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
