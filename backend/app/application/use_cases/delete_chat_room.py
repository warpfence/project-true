"""채팅방 삭제 Use Case.

소유권을 검증한 후, 채팅방과 메시지를 아카이브 테이블에 백업하고 원본을 삭제한다.
"""

from uuid import UUID

from app.domain.repositories.archive_repository import AbstractArchiveRepository
from app.domain.repositories.chat_room_repository import (
    AbstractChatRoomRepository,
)


class DeleteChatRoomUseCase:
    """채팅방을 아카이브 후 삭제한다."""

    def __init__(
        self,
        chat_room_repository: AbstractChatRoomRepository,
        archive_repository: AbstractArchiveRepository,
    ) -> None:
        self._chat_room_repo = chat_room_repository
        self._archive_repo = archive_repository

    async def execute(self, user_id: UUID, room_id: UUID) -> None:
        """채팅방 삭제를 실행한다.

        Args:
            user_id: 요청 사용자 ID
            room_id: 삭제 대상 채팅방 ID

        Raises:
            ValueError: 채팅방이 존재하지 않거나 소유권이 없는 경우
        """
        chat_room = await self._chat_room_repo.find_by_id(room_id)
        if chat_room is None:
            raise ValueError("채팅방을 찾을 수 없습니다.")

        if chat_room.user_id != user_id:
            raise ValueError("해당 채팅방에 접근 권한이 없습니다.")

        await self._archive_repo.archive_chat_room(room_id)
