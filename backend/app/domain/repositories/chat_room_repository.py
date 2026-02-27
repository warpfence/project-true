"""채팅방 리포지토리 추상 인터페이스."""

from abc import ABC, abstractmethod
from uuid import UUID

from app.domain.entities.chat_room import ChatRoom


class AbstractChatRoomRepository(ABC):
    """채팅방 데이터 접근을 위한 추상 인터페이스."""

    @abstractmethod
    async def find_by_id(self, room_id: UUID) -> ChatRoom | None:
        """ID로 채팅방을 조회한다."""
        ...

    @abstractmethod
    async def find_by_user_id(
        self,
        user_id: UUID,
        status: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[ChatRoom]:
        """사용자 ID로 채팅방 목록을 조회한다."""
        ...

    @abstractmethod
    async def count_by_user_id(
        self, user_id: UUID, status: str | None = None
    ) -> int:
        """사용자의 채팅방 수를 반환한다."""
        ...

    @abstractmethod
    async def save(self, chat_room: ChatRoom) -> ChatRoom:
        """채팅방을 저장(생성)한다."""
        ...

    @abstractmethod
    async def update(self, chat_room: ChatRoom) -> ChatRoom:
        """채팅방 정보를 갱신한다."""
        ...
