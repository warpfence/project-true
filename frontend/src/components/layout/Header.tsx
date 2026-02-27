"use client";

/**
 * Header 컴포넌트.
 *
 * 좌측 프로젝트 이름, 우측 Avatar + DropdownMenu로 프로필/로그아웃.
 * UserContext를 통해 DB 닉네임을 실시간으로 반영한다.
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/contexts/UserContext";
import { PROJECT_NAME } from "@/lib/constants";
import { LogOut, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { logout } = useAuth();
  const { data: session } = useSession();
  const { user } = useUser();

  const userName = user?.nickname || session?.user?.name || "사용자";
  const userImage = user?.profile_image_url || session?.user?.image || undefined;
  const userInitial = userName.charAt(0);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4 lg:px-6">
      <Link href="/main/start" className="font-semibold text-lg">
        {PROJECT_NAME}
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex items-center gap-2 p-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/main/account" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              계정 정보
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
