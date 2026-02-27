"""전문가 도메인 엔티티."""

from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class Expert:
    """AI가 구현하는 상담 전문가 캐릭터."""

    expert_type: str
    name: str
    description: str
    system_prompt: str
    id: UUID = field(default_factory=uuid4)
    icon: str | None = None
    created_at: datetime = field(default_factory=datetime.now)
