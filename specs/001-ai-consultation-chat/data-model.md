# Data Model: AI 전문가 상담 채팅 서비스

**Branch**: `001-ai-consultation-chat` | **Date**: 2026-02-27

## Entity Relationship Diagram

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│  users   │──1:N──│  chat_rooms  │──N:1──│  experts │
│          │       │              │       │          │
│ id (PK)  │       │ id (PK)      │       │ id (PK)  │
│ google_id│       │ user_id (FK) │       │ expert_  │
│ email    │       │ expert_id(FK)│       │   type   │
│ nickname │       │ title        │       │ name     │
│ profile_ │       │ status       │       │ descrip. │
│  image   │       │ summary      │       │ system_  │
│ subscri_ │       │ created_at   │       │  prompt  │
│  ption   │       │ updated_at   │       │ icon     │
│ created_ │       └──────┬───────┘       │ created_ │
│  at      │              │               │  at      │
│ updated_ │              │1:N            └──────────┘
│  at      │              │
└──────────┘       ┌──────┴───────┐
                   │   messages   │
                   │              │
                   │ id (PK)      │
                   │ chat_room_id │
                   │   (FK)       │
                   │ role         │
                   │ content      │
                   │ created_at   │
                   └──────────────┘
```

## Entities

### User (사용자)

서비스를 이용하는 개인. 구글 계정으로 식별된다.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | 고유 식별자 |
| google_id | VARCHAR(255) | UNIQUE, NOT NULL | 구글 계정 고유 ID (sub) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 주소 |
| nickname | VARCHAR(100) | NOT NULL | 사용자 닉네임 (초기값: 구글 이름) |
| profile_image_url | TEXT | nullable | 프로필 이미지 URL |
| subscription_type | VARCHAR(20) | DEFAULT 'free' | 구독 유형 (현재 free만 지원) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 계정 생성 시각 |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | 마지막 수정 시각 |

**Validation Rules**:
- email: 유효한 이메일 형식
- nickname: 1~100자, 공백만으로 구성 불가
- subscription_type: 'free' 또는 'premium' 중 하나

---

### Expert (전문가)

AI가 구현하는 상담 전문가 캐릭터. 시드 데이터로 4개가 고정 등록된다.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | 고유 식별자 |
| expert_type | VARCHAR(20) | UNIQUE, NOT NULL | 분야 코드 (career/love/fortune/parenting) |
| name | VARCHAR(100) | NOT NULL | 전문가 캐릭터 이름 |
| description | TEXT | NOT NULL | 전문가 소개 문구 |
| system_prompt | TEXT | NOT NULL | AI 행동 규칙 (시스템 프롬프트) |
| icon | VARCHAR(10) | nullable | 이모지 아이콘 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 생성 시각 |

**Validation Rules**:
- expert_type: 'career', 'love', 'fortune', 'parenting' 중 하나
- name: 1~100자
- system_prompt: 비어있지 않아야 함

**Seed Data**:
| expert_type | name | icon |
|-------------|------|------|
| career | 커리어 컨설턴트 김커리어 | 💼 |
| love | 연애 상담사 이하트 | 💕 |
| fortune | 사주 상담사 박운세 | 🔮 |
| parenting | 육아 상담사 최아이 | 👶 |

---

### ChatRoom (채팅방)

사용자와 전문가 간의 1:1 상담 공간.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | 고유 식별자 |
| user_id | UUID | FK → users.id, ON DELETE CASCADE, NOT NULL | 소유 사용자 |
| expert_id | UUID | FK → experts.id, NOT NULL | 담당 전문가 |
| title | VARCHAR(200) | nullable | 채팅방 제목 (AI 자동 생성, 초기 NULL) |
| status | VARCHAR(20) | DEFAULT 'active' | 상태 코드 |
| summary | TEXT | nullable | 상담 요약 (JSON 형식) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 생성 시각 |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | 마지막 활동 시각 |

**Validation Rules**:
- status: 'active' 또는 'completed' 중 하나
- title: 최대 200자
- summary: JSON 형식 (주제, 핵심 조언, 액션 아이템 포함)

**State Transitions**:
```
active → completed (상담 요약 생성 시)
```

**Indexes**:
- `idx_chat_rooms_user_id` ON (user_id) — 사용자별 채팅방 목록 조회 최적화

---

### Message (메시지)

채팅방 내의 개별 발화.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | 고유 식별자 |
| chat_room_id | UUID | FK → chat_rooms.id, ON DELETE CASCADE, NOT NULL | 소속 채팅방 |
| role | VARCHAR(10) | NOT NULL | 발신자 유형 |
| content | TEXT | NOT NULL | 메시지 내용 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 전송 시각 |

**Validation Rules**:
- role: 'user' 또는 'assistant' 중 하나
- content: 비어있지 않아야 하며, 사용자 메시지는 2000자 이내

**Indexes**:
- `idx_messages_chat_room_id` ON (chat_room_id) — 채팅방별 메시지 조회 최적화
- `idx_messages_created_at` ON (created_at) — 시간순 정렬 최적화

## Relationships

| 관계 | 설명 | Cardinality |
|------|------|-------------|
| User → ChatRoom | 한 사용자가 여러 채팅방을 가질 수 있다 | 1:N |
| Expert → ChatRoom | 한 전문가가 여러 채팅방에 배정될 수 있다 | 1:N |
| ChatRoom → Message | 한 채팅방에 여러 메시지가 있다 | 1:N |

## Summary JSON Schema

상담 요약 카드 (`chat_rooms.summary` 필드)의 구조:

```json
{
  "topic": "이직 고민 상담",
  "key_advice": [
    "현재 직무에서의 성장 가능성을 먼저 평가하세요",
    "이직 전 포트폴리오를 정리하세요"
  ],
  "action_items": [
    "GitHub 프로젝트 3개 정리",
    "업계 네트워킹 이벤트 참석"
  ]
}
```
