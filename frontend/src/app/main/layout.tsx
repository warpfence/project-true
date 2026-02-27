/**
 * 메인 레이아웃.
 *
 * 상단 헤더 + 왼쪽 사이드바 + 오른쪽 콘텐츠의 3영역 레이아웃.
 * 온보딩 페이지와 동일한 크림 톤 테마를 적용한다.
 */
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-screen flex-col antialiased"
      style={{
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#2B3A55",
      }}
    >
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ background: "#FDFAF5" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
