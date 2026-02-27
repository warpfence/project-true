/**
 * 라우트 보호 미들웨어.
 *
 * 비인증 사용자 → 온보딩 페이지로 리다이렉트
 * 인증 사용자가 / 접근 시 → /main/start로 리다이렉트
 */
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isMainRoute = nextUrl.pathname.startsWith("/main");
  const isAuthApiRoute = nextUrl.pathname.startsWith("/api/auth");
  const isRootRoute = nextUrl.pathname === "/";

  // API 라우트는 미들웨어 스킵
  if (isAuthApiRoute) {
    return NextResponse.next();
  }

  // 비인증 사용자가 보호된 라우트 접근 시 → 온보딩
  if (!isLoggedIn && isMainRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 인증 사용자가 루트 접근 시 → 시작하기 페이지
  if (isLoggedIn && isRootRoute) {
    return NextResponse.redirect(new URL("/main/start", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
