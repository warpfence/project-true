"use client";

/**
 * 계정 정보 페이지.
 *
 * 프로필 이미지, 이메일, 닉네임을 표시하고 닉네임 수정 폼을 제공한다.
 * UserContext를 통해 닉네임 변경 시 Header에도 즉시 반영된다.
 */
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import { updateProfile } from "@/services/userService";

export default function AccountPage() {
  const { data: session } = useSession();
  const { user, isLoading, setUser } = useUser();
  const [nickname, setNickname] = useState("");
  const [nicknameInit, setNicknameInit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Context에서 user가 로드되면 닉네임 초기값을 설정한다.
  if (user && !nicknameInit) {
    setNickname(user.nickname || "");
    setNicknameInit(true);
  }

  const handleSave = async () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const updated = await updateProfile({ nickname: nickname.trim() });
      // Context를 통해 Header 등 다른 컴포넌트에도 즉시 반영
      setUser(updated);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "닉네임 변경에 실패했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          계정 정보
        </h1>
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  const displayName = user?.nickname || session?.user?.name || "";
  const displayEmail = user?.email || session?.user?.email || "";
  const displayImage = user?.profile_image_url || session?.user?.image || "";

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">계정 정보</h1>

      <Card>
        <CardHeader className="items-center pb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={displayImage} alt={displayName} />
            <AvatarFallback className="text-xl">
              {displayName.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 이메일 (읽기 전용) */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">
              이메일
            </label>
            <p className="text-sm text-gray-900">{displayEmail}</p>
          </div>

          {/* 닉네임 */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">
              닉네임
            </label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  maxLength={30}
                  disabled={isSaving}
                />
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "저장 중..." : "저장"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setNickname(user?.nickname || "");
                    setError(null);
                  }}
                  disabled={isSaving}
                >
                  취소
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-900">
                  {displayName || "닉네임을 설정해 주세요"}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </Button>
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
          {success && (
            <p className="text-xs text-green-600">닉네임이 변경되었습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
