"""메시지 리포지토리 추상 인터페이스."""

from abc import ABC, abstractmethod
from datetime import datetime
from uuid import UUID

from app.domain.entities.message import Message


class AbstractMessageRepository(ABC):
    """메시지 데이터 접근을 위한 추상 인터페이스."""

    @abstractmethod
    async def find_by_chat_room_id(
        self,
        chat_room_id: UUID,
        limit: int = 50,
        before: datetime | None = None,
        latest_first: bool = False,
    ) -> list[Message]:
        """채팅방 ID로 메시지 목록을 조회한다."""
        ...

    @abstractmethod
    async def count_by_chat_room_id(self, chat_room_id: UUID) -> int:
        """채팅방의 메시지 수를 반환한다."""
        ...

    @abstractmethod
    async def save(self, message: Message) -> Message:
        """메시지를 저장한다."""
        ...
