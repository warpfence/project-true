"""채팅방 도메인 엔티티."""

from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class ChatRoom:
    """사용자와 전문가 간의 1:1 상담 공간."""

    user_id: UUID
    expert_id: UUID
    id: UUID = field(default_factory=uuid4)
    title: str | None = None
    status: str = "active"
    summary: str | None = None
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
