"""메시지 도메인 엔티티."""

from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class Message:
    """채팅방 내의 개별 발화."""

    chat_room_id: UUID
    role: str
    content: str
    id: UUID = field(default_factory=uuid4)
    created_at: datetime = field(default_factory=datetime.now)
