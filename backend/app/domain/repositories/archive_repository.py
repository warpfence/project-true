"""아카이브 리포지토리 추상 인터페이스."""

from abc import ABC, abstractmethod
from uuid import UUID


class AbstractArchiveRepository(ABC):
    """채팅방 아카이브 데이터 접근을 위한 추상 인터페이스."""

    @abstractmethod
    async def archive_chat_room(self, room_id: UUID) -> bool:
        """채팅방과 메시지를 아카이브 테이블에 백업한 후 원본을 삭제한다.

        Args:
            room_id: 아카이브할 채팅방 ID

        Returns:
            성공 여부
        """
        ...
