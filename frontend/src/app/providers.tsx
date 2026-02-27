"use client";

/**
 * SessionProvider 래퍼 + API 토큰 초기화.
 *
 * NextAuth SessionProvider를 제공하고,
 * 세션의 accessToken을 API 클라이언트에 연결한다.
 */
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { setAccessTokenGetter } from "@/services/api";
import { UserProvider } from "@/contexts/UserContext";

interface ProvidersProps {
  children: React.ReactNode;
}

/** 세션 accessToken을 API 클라이언트에 주입하는 컴포넌트 */
function ApiTokenInitializer({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const sessionRef = useRef(session);
  sessionRef.current = session;

  useEffect(() => {
    // ref를 통해 항상 최신 session을 읽으므로 클로저 문제가 발생하지 않는다.
    setAccessTokenGetter(async () => sessionRef.current?.accessToken ?? null);
  }, []);

  return <>{children}</>;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ApiTokenInitializer>
        <UserProvider>{children}</UserProvider>
      </ApiTokenInitializer>
    </SessionProvider>
  );
}
