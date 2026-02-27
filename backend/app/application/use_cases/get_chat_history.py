"""상담 이력 조회 Use Case.

사용자의 채팅방 목록을 최신순으로 조회하며, 마지막 메시지 미리보기를 제공한다.
"""

from uuid import UUID

from app.domain.repositories.chat_room_repository import (
    AbstractChatRoomRepository,
)
from app.domain.repositories.expert_repository import AbstractExpertRepository
from app.domain.repositories.message_repository import (
    AbstractMessageRepository,
)


class GetChatHistoryUseCase:
    """사용자의 상담 이력을 조회한다."""

    def __init__(
        self,
        chat_room_repository: AbstractChatRoomRepository,
        expert_repository: AbstractExpertRepository,
        message_repository: AbstractMessageRepository,
    ) -> None:
        self._chat_room_repo = chat_room_repository
        self._expert_repo = expert_repository
        self._message_repo = message_repository

    async def execute(
        self,
        user_id: UUID,
        status: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> dict:
        """상담 이력 목록을 반환한다.

        Args:
            user_id: 사용자 ID
            status: 필터링할 채팅방 상태 (active/completed)
            limit: 조회 개수
            offset: 오프셋

        Returns:
            채팅방 목록과 전체 개수를 포함한 딕셔너리
        """
        rooms = await self._chat_room_repo.find_by_user_id(
            user_id=user_id,
            status=status,
            limit=limit,
            offset=offset,
        )
        total = await self._chat_room_repo.count_by_user_id(
            user_id=user_id,
            status=status,
        )

        result = []
        for room in rooms:
            expert = await self._expert_repo.find_by_id(room.expert_id)

            # 마지막 메시지 미리보기
            messages = await self._message_repo.find_by_chat_room_id(
                chat_room_id=room.id,
                limit=1,
            )
            last_preview = None
            if messages:
                content = messages[0].content
                last_preview = content[:50] + "..." if len(content) > 50 else content

            result.append({
                "id": str(room.id),
                "expert_name": expert.name if expert else "",
                "expert_type": expert.expert_type if expert else "",
                "expert_icon": expert.icon if expert else "",
                "title": room.title,
                "status": room.status,
                "last_message_preview": last_preview,
                "updated_at": room.updated_at.isoformat(),
            })

        return {"rooms": result, "total": total}
