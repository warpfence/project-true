"use client";

/**
 * Sidebar 컴포넌트.
 *
 * 데스크톱: 왼쪽 고정 사이드바
 * 모바일: Sheet(드로어) 방식
 */
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { SIDEBAR_MENU } from "@/lib/constants";
import {
  Play,
  History,
  HelpCircle,
  User,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const iconMap = {
  Play,
  History,
  HelpCircle,
  User,
} as const;

function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {SIDEBAR_MENU.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap];
        const isActive = pathname === item.href;

        return (
          <Button
            key={item.href}
            variant="ghost"
            className={`justify-start gap-3 ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            }`}
            asChild
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside className="hidden md:flex w-56 flex-col border-r bg-white">
        <SidebarNav />
      </aside>

      {/* 모바일 Sheet 트리거 (헤더 하단에 고정) */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full shadow-lg">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 p-0">
            <div className="p-4 font-semibold">메뉴</div>
            <Separator />
            <SidebarNav />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
