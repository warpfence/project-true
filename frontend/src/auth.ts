/**
 * NextAuth v5 설정.
 *
 * Google Provider를 사용하고, jwt() 콜백에서 id_token을 캡처하여
 * FastAPI 백엔드로 전달한 후 받은 JWT를 세션에 저장한다.
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * 서버사이드 API URL.
 * Docker 환경에서 NextAuth 콜백은 frontend 컨테이너 내부에서 실행되므로
 * localhost가 아닌 Docker 내부 네트워크 주소(INTERNAL_API_URL)를 우선 사용한다.
 */
const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // 최초 로그인 시 Google id_token을 FastAPI에 전달하여 JWT 발급
      if (account?.id_token) {
        try {
          const res = await fetch(`${API_URL}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token: account.id_token }),
          });

          if (res.ok) {
            const data = await res.json();
            token.accessToken = data.access_token;
            token.refreshToken = data.refresh_token;
            token.expiresAt = Date.now() + data.expires_in * 1000;
          }
        } catch {
          // 백엔드 연결 실패 시 기본 세션 유지
        }
      }

      // Access Token 만료 시 갱신
      if (token.expiresAt && Date.now() > (token.expiresAt as number)) {
        try {
          const res = await fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: token.refreshToken }),
          });

          if (res.ok) {
            const data = await res.json();
            token.accessToken = data.access_token;
            token.refreshToken = data.refresh_token;
            token.expiresAt = Date.now() + data.expires_in * 1000;
          }
        } catch {
          // 갱신 실패 시 기존 토큰 유지
        }
      }

      return token;
    },
    async session({ session, token }) {
      // 세션에 FastAPI JWT 정보 추가
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
