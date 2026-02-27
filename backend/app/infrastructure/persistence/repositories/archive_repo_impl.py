"""아카이브 리포지토리 구현체."""

from uuid import UUID

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.archive_repository import AbstractArchiveRepository


class ArchiveRepositoryImpl(AbstractArchiveRepository):
    """SQLAlchemy 기반 아카이브 리포지토리 구현체."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def archive_chat_room(self, room_id: UUID) -> bool:
        """채팅방과 메시지를 아카이브 테이블에 백업한 후 원본을 삭제한다."""
        # 1. 메시지를 아카이브 테이블에 복사
        await self._session.execute(
            text(
                "INSERT INTO archived_messages "
                "(id, chat_room_id, role, content, created_at, archived_at) "
                "SELECT id, chat_room_id, role, content, created_at, NOW() "
                "FROM messages WHERE chat_room_id = :room_id"
            ),
            {"room_id": room_id},
        )

        # 2. 채팅방을 아카이브 테이블에 복사
        await self._session.execute(
            text(
                "INSERT INTO archived_chat_rooms "
                "(id, user_id, expert_id, title, status, summary, "
                "created_at, updated_at, archived_at) "
                "SELECT id, user_id, expert_id, title, status, summary, "
                "created_at, updated_at, NOW() "
                "FROM chat_rooms WHERE id = :room_id"
            ),
            {"room_id": room_id},
        )

        # 3. 원본 채팅방 삭제 (CASCADE로 messages 자동 삭제)
        result = await self._session.execute(
            text("DELETE FROM chat_rooms WHERE id = :room_id"),
            {"room_id": room_id},
        )

        return result.rowcount > 0
