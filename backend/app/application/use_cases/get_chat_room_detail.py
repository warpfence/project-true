"""채팅방 상세 조회 Use Case.

채팅방 정보와 메시지 목록을 조회하며, 소유자 검증과 커서 기반 페이지네이션을 지원한다.
"""

from datetime import datetime
from uuid import UUID

from app.domain.repositories.chat_room_repository import (
    AbstractChatRoomRepository,
)
from app.domain.repositories.expert_repository import AbstractExpertRepository
from app.domain.repositories.message_repository import (
    AbstractMessageRepository,
)


class GetChatRoomDetailUseCase:
    """채팅방 상세 정보를 조회한다."""

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
        room_id: UUID,
        limit: int = 50,
        before: str | None = None,
    ) -> dict:
        """채팅방 상세 정보를 반환한다.

        Args:
            user_id: 현재 사용자 ID
            room_id: 채팅방 ID
            limit: 메시지 조회 개수
            before: 커서 (이 시점 이전 메시지를 조회)

        Returns:
            채팅방 상세 정보 딕셔너리

        Raises:
            ValueError: 채팅방이 없거나 권한이 없는 경우
        """
        chat_room = await self._chat_room_repo.find_by_id(room_id)
        if chat_room is None:
            raise ValueError("채팅방을 찾을 수 없습니다.")
        if chat_room.user_id != user_id:
            raise ValueError("해당 채팅방에 접근 권한이 없습니다.")

        expert = await self._expert_repo.find_by_id(chat_room.expert_id)

        # 커서 파싱
        before_dt = None
        if before:
            try:
                before_dt = datetime.fromisoformat(before)
            except ValueError:
                pass

        messages = await self._message_repo.find_by_chat_room_id(
            chat_room_id=room_id,
            limit=limit + 1,  # 다음 페이지 존재 여부 확인을 위해 +1
            before=before_dt,
        )

        has_more = len(messages) > limit
        if has_more:
            messages = messages[:limit]

        # 시간순 정렬 (오래된 순)
        messages.sort(key=lambda m: m.created_at)

        # summary 파싱
        summary = None
        if chat_room.summary:
            import json
            try:
                summary = json.loads(chat_room.summary)
            except (json.JSONDecodeError, TypeError):
                summary = None

        return {
            "id": str(chat_room.id),
            "expert_name": expert.name if expert else "",
            "expert_type": expert.expert_type if expert else "",
            "expert_icon": expert.icon if expert else "",
            "title": chat_room.title,
            "status": chat_room.status,
            "summary": summary,
            "messages": [
                {
                    "id": str(msg.id),
                    "role": msg.role,
                    "content": msg.content,
                    "created_at": msg.created_at.isoformat(),
                }
                for msg in messages
            ],
            "has_more": has_more,
        }
