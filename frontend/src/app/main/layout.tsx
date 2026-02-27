/**
 * 메인 레이아웃.
 *
 * 상단 헤더 + 왼쪽 사이드바 + 오른쪽 콘텐츠의 3영역 레이아웃.
 * /main/* 하위의 모든 페이지에 적용된다.
 */
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
