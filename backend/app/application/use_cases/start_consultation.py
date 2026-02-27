"""상담 시작 Use Case.

expert_type으로 전문가를 조회하고, 채팅방을 생성하며, 인사말 메시지를 자동 저장한다.
"""

import re
from uuid import UUID

from app.domain.entities.chat_room import ChatRoom
from app.domain.entities.message import Message
from app.domain.repositories.chat_room_repository import (
    AbstractChatRoomRepository,
)
from app.domain.repositories.expert_repository import AbstractExpertRepository
from app.domain.repositories.message_repository import (
    AbstractMessageRepository,
)


class StartConsultationUseCase:
    """새 상담을 시작한다."""

    def __init__(
        self,
        expert_repository: AbstractExpertRepository,
        chat_room_repository: AbstractChatRoomRepository,
        message_repository: AbstractMessageRepository,
    ) -> None:
        self._expert_repo = expert_repository
        self._chat_room_repo = chat_room_repository
        self._message_repo = message_repository

    async def execute(
        self, user_id: UUID, expert_type: str
    ) -> tuple[ChatRoom, Message]:
        """전문가를 선택하여 새 상담을 시작한다.

        Args:
            user_id: 사용자 ID
            expert_type: 전문가 분야 코드

        Returns:
            생성된 채팅방과 인사말 메시지 튜플

        Raises:
            ValueError: 유효하지 않은 expert_type인 경우
        """
        # 1. 전문가 조회
        expert = await self._expert_repo.find_by_type(expert_type)
        if expert is None:
            raise ValueError(f"유효하지 않은 전문가 분야입니다: {expert_type}")

        # 2. 채팅방 생성
        chat_room = ChatRoom(user_id=user_id, expert_id=expert.id)
        chat_room = await self._chat_room_repo.save(chat_room)

        # 3. 인사말 메시지 추출 및 저장
        greeting = self._extract_greeting(expert.system_prompt)
        greeting_message = Message(
            chat_room_id=chat_room.id,
            role="assistant",
            content=greeting,
        )
        greeting_message = await self._message_repo.save(greeting_message)

        return chat_room, greeting_message

    @staticmethod
    def _extract_greeting(system_prompt: str) -> str:
        """시스템 프롬프트에서 인사말을 추출한다."""
        # [인사말] 섹션 이후의 텍스트를 추출
        match = re.search(
            r'\[인사말\]\s*\n?"?(.+?)"?\s*$',
            system_prompt,
            re.DOTALL,
        )
        if match:
            return match.group(1).strip().strip('"')
        return "안녕하세요, 무엇을 도와드릴까요?"
