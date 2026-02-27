"""사용자 도메인 엔티티."""

from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class User:
    """서비스를 이용하는 사용자."""

    google_id: str
    email: str
    nickname: str
    id: UUID = field(default_factory=uuid4)
    profile_image_url: str | None = None
    subscription_type: str = "free"
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
