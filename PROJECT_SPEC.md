# 프로젝트 상세 명세서

## 1. 서비스 시나리오

### 1.1 전체 플로우

```
[온보딩 랜딩 페이지 (비로그인 시 무조건 표시)]
  └─ "지금 시작하기" 클릭
       ↓
[구글 로그인 (Google OAuth)]
       ↓
[메인 화면 (3영역: 헤더 + 사이드바 + 콘텐츠)]
  ├─ 시작하기 → 전문가 선택 → 채팅방 생성 → 상담 진행 → 요약
  ├─ 나의 상담 이력 → 기존 채팅 이어서 하기 / 요약 확인
  ├─ 도움말
  └─ 계정 정보
```

### 1.2 온보딩 (랜딩 페이지)

- 웹 접속 시 비로그인 상태면 무조건 보이는 첫 화면
- 원페이지 구성 (스크롤), 3개 섹션 순서:
  1. **CTA 섹션**: 프로젝트 로고 + "지금 시작하기" 버튼 (구글 로그인 트리거)
  2. **서비스 소개 섹션**: "AI 전문가에게 부담 없이 상담받아 보세요" + 서비스 설명
  3. **상담 분야 소개 섹션**: 취업/연애/사주/육아 4개 카드
- 하단 푸터: 면책 문구 상시 표시

### 1.3 메인 화면 (로그인 후)

3개 영역:
- **상단 헤더**: 프로젝트 이름(좌측) + 사용자 프로필 아이콘(우측)
- **왼쪽 사이드바 메뉴**:
  - 시작하기 (기본 선택)
  - 나의 상담 이력
  - 도움말
  - 계정 정보
- **오른쪽 메인 콘텐츠**: 선택한 메뉴에 해당하는 페이지 표시

### 1.4 채팅방

- 전문가 선택 시 새 채팅방 자동 생성 → "나의 상담 이력"에 즉시 추가
- UI 구성:
  - 상단바: 뒤로가기 버튼 + 전문가 이름 + 분야
  - 대화 영역: 메신저 형태 말풍선 (AI=왼쪽, 사용자=오른쪽)
  - 면책 문구: 입력창 바로 위에 작은 글씨로 상시 노출
  - 하단 입력창: 텍스트 입력 + 전송 버튼 (Enter키 전송 가능)

### 1.5 AI 전문가 행동 규칙

- 상황 파악 질문을 먼저 던진다 (바로 답 주지 않음)
- 단계적으로 조언한다 (핵심 조언 → 구체적 행동 → 추가 질문 확인)
- 위험 주제에서는 면책 안내를 삽입한다

### 1.6 상담 마무리 및 요약

- 사용자가 종료 신호("고마워요", "이제 됐어요" 등)를 보내면 AI가 상담 정리
- 상담 요약 카드 생성: 주제, 핵심 조언, 다음 액션 아이템
- 채팅방 제목 자동 생성 (AI가 대화 기반으로)

### 1.7 재방문

- 자동 로그인 → 메인 화면
- "나의 상담 이력"에서 기존 채팅 클릭 → 이어서 상담
- "시작하기"에서 새 상담 시작 가능 (같은 분야도 독립 채팅)

---

## 2. 데이터베이스 스키마

### users 테이블
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    profile_image_url TEXT,
    subscription_type VARCHAR(20) DEFAULT 'free',  -- free / premium
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### experts 테이블
```sql
CREATE TABLE experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_type VARCHAR(20) UNIQUE NOT NULL,  -- career / love / fortune / parenting
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    icon VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### chat_rooms 테이블
```sql
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expert_id UUID NOT NULL REFERENCES experts(id),
    title VARCHAR(200),  -- AI가 자동 생성, 초기값 NULL
    status VARCHAR(20) DEFAULT 'active',  -- active / completed
    summary TEXT,  -- 상담 요약 (JSON)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_chat_rooms_user_id ON chat_rooms(user_id);
```

### messages 테이블
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL,  -- 'user' / 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_messages_chat_room_id ON messages(chat_room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### 초기 데이터 (experts seed)
```sql
INSERT INTO experts (expert_type, name, description, system_prompt, icon) VALUES
('career', '커리어 컨설턴트 김커리어', '취업, 이직, 면접 준비, 자기소개서 등 커리어 전반에 대해 상담합니다.', '[시스템 프롬프트]', '💼'),
('love', '연애 상담사 이하트', '연애, 썸, 관계 고민, 이별 등 연애 전반에 대해 상담합니다.', '[시스템 프롬프트]', '💕'),
('fortune', '사주 상담사 박운세', '사주팔자, 올해 운세, 궁합 등을 풀이하고 조언합니다.', '[시스템 프롬프트]', '🔮'),
('parenting', '육아 상담사 최아이', '육아, 아이 발달, 교육, 부모 고민 등에 대해 상담합니다.', '[시스템 프롬프트]', '👶');
```

---

## 3. 백엔드 API 명세

### 3.1 인증 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/google` | 구글 OAuth 토큰으로 로그인/회원가입 → JWT 반환 |
| POST | `/api/auth/refresh` | JWT 갱신 |
| GET | `/api/auth/me` | 현재 로그인 사용자 정보 조회 |

### 3.2 전문가 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/experts` | 전문가 목록 조회 (4개) |
| GET | `/api/experts/{expert_type}` | 특정 전문가 정보 조회 |

### 3.3 채팅 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/chat/rooms` | 새 채팅방 생성 (body: expert_type) |
| GET | `/api/chat/rooms` | 내 채팅방 목록 조회 (나의 상담 이력) |
| GET | `/api/chat/rooms/{room_id}` | 채팅방 상세 조회 (메시지 포함) |
| POST | `/api/chat/rooms/{room_id}/messages` | 메시지 전송 → AI 응답 반환 |
| POST | `/api/chat/rooms/{room_id}/summary` | 상담 요약 생성 요청 |
| PATCH | `/api/chat/rooms/{room_id}` | 채팅방 정보 수정 (제목 등) |

### 3.4 사용자 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/users/me` | 내 정보 조회 |
| PATCH | `/api/users/me` | 내 정보 수정 (닉네임 등) |

### 3.5 메시지 전송 상세 (POST /api/chat/rooms/{room_id}/messages)

**Request:**
```json
{
  "content": "이직 고민이에요"
}
```

**Response (SSE 스트리밍):**
```
data: {"type": "chunk", "content": "안녕"}
data: {"type": "chunk", "content": "하세요,"}
data: {"type": "chunk", "content": " 어떤"}
...
data: {"type": "done", "message_id": "uuid", "full_content": "안녕하세요, 어떤 ..."}
```

**내부 로직:**
1. 사용자 메시지를 DB에 저장
2. 해당 채팅방의 이전 메시지 이력 조회
3. 해당 전문가의 system_prompt 조회
4. Gemini API 호출 (system_prompt + 대화 이력 + 새 메시지)
5. AI 응답을 SSE로 스트리밍 전송
6. 완료 후 AI 응답을 DB에 저장

---

## 4. 백엔드 프로젝트 구조 (Clean Architecture)

```
backend/
├── app/
│   ├── domain/                          # 🔵 Domain Layer (Entities)
│   │   ├── __init__.py
│   │   ├── entities/
│   │   │   ├── __init__.py
│   │   │   ├── user.py                  # User 엔티티 (dataclass)
│   │   │   ├── expert.py                # Expert 엔티티
│   │   │   ├── chat_room.py             # ChatRoom 엔티티
│   │   │   └── message.py               # Message 엔티티
│   │   └── repositories/
│   │       ├── __init__.py
│   │       ├── user_repository.py       # UserRepository ABC
│   │       ├── expert_repository.py     # ExpertRepository ABC
│   │       ├── chat_room_repository.py  # ChatRoomRepository ABC
│   │       └── message_repository.py    # MessageRepository ABC
│   │
│   ├── application/                     # 🟢 Application Layer (Use Cases)
│   │   ├── __init__.py
│   │   ├── use_cases/
│   │   │   ├── __init__.py
│   │   │   ├── auth_user.py             # 구글 로그인 처리
│   │   │   ├── start_consultation.py    # 상담 시작 (채팅방 생성)
│   │   │   ├── send_message.py          # 메시지 전송 + AI 응답
│   │   │   ├── get_chat_history.py      # 상담 이력 조회
│   │   │   ├── get_chat_room_detail.py  # 채팅방 상세 (메시지 포함)
│   │   │   ├── summarize_consultation.py # 상담 요약 생성
│   │   │   └── get_experts.py           # 전문가 목록 조회
│   │   ├── dto/
│   │   │   ├── __init__.py
│   │   │   ├── auth_dto.py
│   │   │   ├── chat_dto.py
│   │   │   └── user_dto.py
│   │   └── interfaces/
│   │       ├── __init__.py
│   │       └── ai_client.py             # AIClient ABC (Gemini 추상화)
│   │
│   ├── infrastructure/                  # 🟡 Infrastructure Layer
│   │   ├── __init__.py
│   │   ├── persistence/
│   │   │   ├── __init__.py
│   │   │   ├── database.py              # SQLAlchemy 엔진/세션 설정
│   │   │   ├── models.py                # ORM 모델 (User, Expert, ChatRoom, Message)
│   │   │   └── repositories/
│   │   │       ├── __init__.py
│   │   │       ├── user_repo_impl.py
│   │   │       ├── expert_repo_impl.py
│   │   │       ├── chat_room_repo_impl.py
│   │   │       └── message_repo_impl.py
│   │   ├── external/
│   │   │   ├── __init__.py
│   │   │   ├── gemini_client.py         # Gemini API 클라이언트 (AIClient 구현)
│   │   │   └── google_auth.py           # Google OAuth 토큰 검증
│   │   └── config/
│   │       ├── __init__.py
│   │       └── settings.py              # Pydantic Settings (환경 변수)
│   │
│   ├── presentation/                    # 🔴 Presentation Layer (API)
│   │   ├── __init__.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth_router.py
│   │   │   ├── expert_router.py
│   │   │   ├── chat_router.py
│   │   │   └── user_router.py
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   └── auth_middleware.py       # JWT 인증 미들웨어
│   │   └── dependencies.py              # FastAPI DI (Depends)
│   │
│   └── main.py                          # FastAPI 앱 진입점
│
├── alembic/                             # DB 마이그레이션
│   ├── versions/
│   ├── env.py
│   └── alembic.ini
├── seed/
│   └── seed_experts.py                  # 초기 전문가 데이터 시드
├── tests/
│   ├── unit/
│   └── integration/
├── requirements.txt
├── Dockerfile
├── .env.example
└── README.md
```

---

## 5. 프론트엔드 프로젝트 구조

```
frontend/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # 루트 레이아웃
│   │   ├── page.tsx                      # 온보딩 랜딩 페이지 (/)
│   │   ├── globals.css
│   │   ├── providers.tsx                 # SessionProvider 등 래퍼
│   │   ├── main/                         # 로그인 후 메인 영역
│   │   │   ├── layout.tsx                # 메인 레이아웃 (헤더+사이드바+콘텐츠)
│   │   │   ├── start/
│   │   │   │   └── page.tsx              # 시작하기 (전문가 선택)
│   │   │   ├── history/
│   │   │   │   └── page.tsx              # 나의 상담 이력
│   │   │   ├── chat/
│   │   │   │   └── [roomId]/
│   │   │   │       └── page.tsx          # 채팅방
│   │   │   ├── help/
│   │   │   │   └── page.tsx              # 도움말
│   │   │   └── account/
│   │   │       └── page.tsx              # 계정 정보
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts          # NextAuth Google Provider
│   │
│   ├── components/
│   │   ├── onboarding/
│   │   │   ├── HeroSection.tsx           # CTA (시작하기 버튼)
│   │   │   ├── IntroSection.tsx          # 서비스 소개
│   │   │   └── CategorySection.tsx       # 상담 분야 소개
│   │   ├── layout/
│   │   │   ├── Header.tsx                # 상단 헤더
│   │   │   └── Sidebar.tsx               # 왼쪽 사이드바 메뉴
│   │   ├── chat/
│   │   │   ├── ChatRoom.tsx              # 채팅방 전체 컨테이너
│   │   │   ├── MessageBubble.tsx         # 개별 말풍선
│   │   │   ├── MessageList.tsx           # 메시지 목록 (스크롤)
│   │   │   ├── ChatInput.tsx             # 하단 입력창
│   │   │   ├── ChatHeader.tsx            # 채팅방 상단바
│   │   │   ├── TypingIndicator.tsx       # AI 타이핑 표시 (...)
│   │   │   ├── SummaryCard.tsx           # 상담 요약 카드
│   │   │   └── DisclaimerBanner.tsx      # 면책 문구 배너
│   │   ├── expert/
│   │   │   └── ExpertCard.tsx            # 전문가 선택 카드
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── hooks/
│   │   ├── useChat.ts                    # 채팅 로직 (메시지 전송/수신, SSE)
│   │   ├── useAuth.ts                    # 인증 상태
│   │   ├── useChatRooms.ts               # 채팅방 목록
│   │   └── useExperts.ts                 # 전문가 목록
│   │
│   ├── services/
│   │   ├── api.ts                        # Axios 인스턴스 + 인터셉터
│   │   ├── authService.ts                # 인증 관련 API
│   │   ├── chatService.ts                # 채팅 관련 API
│   │   ├── expertService.ts              # 전문가 관련 API
│   │   └── userService.ts                # 사용자 관련 API
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── expert.ts
│   │   ├── chat.ts
│   │   └── message.ts
│   │
│   └── lib/
│       ├── auth.ts                       # NextAuth 설정
│       └── constants.ts                  # 상수 (면책 문구 등)
│
├── public/
│   └── images/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile
```

---

## 6. 전문가 시스템 프롬프트

### 6.1 공통 규칙 (모든 전문가에 적용)

```
[공통 규칙]
1. 당신은 해당 분야의 전문가입니다. 전문가 페르소나를 일관되게 유지하세요.
2. 사용자의 상황을 먼저 파악하는 질문을 던지세요. 바로 답변하지 마세요.
3. 충분한 정보가 모이면 단계적으로 조언하세요: 핵심 조언 → 구체적 행동 제안 → 추가 궁금점 확인
4. 한국어로 대화하며, 존댓말을 사용하세요.
5. 친근하고 따뜻한 톤을 유지하되 전문성을 잃지 마세요.
6. 모르는 것은 모른다고 솔직하게 말하세요.
7. 위험 상황(건강 이상, 심각한 갈등 등)에서는 반드시 전문가/기관 방문을 권유하세요.
8. 대화 종료 시 핵심 조언과 다음 액션 아이템을 정리해 주세요.
9. 절대로 "AI입니다", "언어 모델입니다"라고 말하지 마세요.
```

### 6.2 취업 전문가 (career)

```
당신은 "커리어 컨설턴트 김커리어"입니다.
15년 경력의 커리어 컨설턴트로, 취업, 이직, 면접 준비, 자기소개서 작성, 연봉 협상 등을 전문으로 합니다.

[추가 규칙]
- 사용자의 현재 직무, 경력, 기술 스택을 먼저 파악하세요.
- 조언은 구체적이고 실행 가능해야 합니다 (예: "포트폴리오를 정리하세요" → "GitHub에 프로젝트 3개를 정리하고 README를 작성하세요").
- 시장 동향이나 연봉 정보를 언급할 때는 "일반적으로", "보통" 등의 표현을 사용하세요.
- 자기소개서나 면접 답변을 요청받으면 구조와 방향을 제시하되, 완성된 글을 대신 써주지는 마세요.

[인사말]
"안녕하세요, 커리어 컨설턴트 김커리어입니다. 취업, 이직, 면접 준비 등 커리어에 관한 고민이라면 편하게 말씀해 주세요."
```

### 6.3 연애 전문가 (love)

```
당신은 "연애 상담사 이하트"입니다.
10년 경력의 연애 상담 전문가로, 썸, 연애, 관계 갈등, 이별 극복 등을 전문으로 합니다.

[추가 규칙]
- 판단을 내려주지 말고, 사용자가 스스로 결정할 수 있도록 도우세요.
- 감정을 먼저 공감한 후 조언으로 넘어가세요.
- 상대방을 비난하거나 편을 들지 마세요.
- 심각한 관계 문제(폭력, 학대 등)가 감지되면 전문 상담 기관을 안내하세요.

[인사말]
"안녕하세요, 연애 상담사 이하트입니다. 연애에 관한 어떤 이야기든 편하게 해주세요. 함께 고민해 볼게요."
```

### 6.4 사주 전문가 (fortune)

```
당신은 "사주 상담사 박운세"입니다.
20년 경력의 사주/운세 전문가로, 사주팔자, 운세, 궁합 등을 풀이합니다.

[추가 규칙]
- 생년월일시를 먼저 물어보세요 (양력/음력 구분 포함).
- 사주 풀이는 긍정적인 방향으로 해석하되, 주의할 점도 함께 안내하세요.
- 절대적인 단정("반드시 ~합니다")은 피하고, "~한 흐름이 보입니다", "~할 가능성이 있습니다" 등 유연한 표현을 사용하세요.
- 운세 결과와 함께 실질적인 조언도 덧붙이세요.
- 사주 풀이는 재미와 참고 목적임을 자연스럽게 안내하세요.

[인사말]
"안녕하세요, 사주 상담사 박운세입니다. 생년월일시를 알려주시면 운세의 흐름을 살펴드릴게요."
```

### 6.5 육아 전문가 (parenting)

```
당신은 "육아 상담사 최아이"입니다.
12년 경력의 육아/아동발달 전문가로, 육아, 아이 발달, 교육, 부모 고민 등을 전문으로 합니다.

[추가 규칙]
- 아이의 나이를 먼저 파악하세요 (개월 수 또는 나이).
- 발달 단계에 맞는 조언을 하세요.
- 부모의 감정도 공감하고 격려하세요 ("잘 하고 계세요", "걱정되시는 마음 충분히 이해해요").
- 건강 관련 증상이 언급되면 반드시 소아과/전문의 방문을 권유하세요.
- 육아에 정답은 없다는 태도를 유지하며, 다양한 접근법을 제시하세요.

[인사말]
"안녕하세요, 육아 상담사 최아이입니다. 아이의 나이와 고민을 말씀해 주시면 함께 방법을 찾아볼게요."
```

---

## 7. Docker Compose 구성

```yaml
version: '3.8'

services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: ai_consultation
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:${DB_PASSWORD}@db:5432/ai_consultation
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}

volumes:
  postgres_data:
```

---

## 8. 환경 변수 (.env.example)

```env
# Database
DB_PASSWORD=your_db_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# JWT
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Backend
BACKEND_URL=http://localhost:8000
```

---

## 9. 개발 스프린트 계획

### Sprint 1 — 기반 구축 + 로그인 (1~2주)
- [ ] 백엔드: FastAPI 프로젝트 셋업 + Clean Architecture 디렉토리
- [ ] 백엔드: PostgreSQL 연결 + SQLAlchemy 모델 + Alembic 마이그레이션
- [ ] 백엔드: Google OAuth 인증 + JWT 발급/검증
- [ ] 프론트: Next.js 프로젝트 셋업
- [ ] 프론트: 온보딩 랜딩 페이지 (3섹션 원페이지)
- [ ] 프론트: 구글 로그인 연동 (NextAuth)
- [ ] 프론트: 메인 레이아웃 (헤더 + 사이드바 + 콘텐츠)
- [ ] 인프라: Docker Compose (FastAPI + PostgreSQL)
- [ ] 인프라: .env 환경 변수 관리

### Sprint 2 — 핵심 채팅 기능 (2주)
- [ ] 백엔드: Expert 시드 데이터 삽입
- [ ] 백엔드: 채팅방 생성 API
- [ ] 백엔드: 메시지 전송 API + Gemini API 연동
- [ ] 백엔드: SSE 스트리밍 응답 처리
- [ ] 백엔드: 대화 이력 컨텍스트 관리
- [ ] 프론트: "시작하기" 페이지 (전문가 선택 카드)
- [ ] 프론트: 채팅방 UI (말풍선, 입력창, 상단바, 면책문구)
- [ ] 프론트: SSE 스트리밍 수신 + 타이핑 표시
- [ ] AI: 4개 전문가 시스템 프롬프트 작성 및 테스트

### Sprint 3 — 상담 이력 + 요약 (1~2주)
- [ ] 백엔드: 채팅방 목록 조회 API
- [ ] 백엔드: 상담 요약 생성 API (Gemini)
- [ ] 백엔드: 채팅방 제목 자동 생성
- [ ] 프론트: "나의 상담 이력" 페이지
- [ ] 프론트: 기존 채팅 이어서 하기
- [ ] 프론트: 상담 요약 카드 컴포넌트
- [ ] 프론트: 사이드바에 최근 상담 표시

### Sprint 4 — 마무리 + 품질 (1~2주)
- [ ] 프론트: "도움말" 페이지
- [ ] 프론트: "계정 정보" 페이지
- [ ] 프론트: 반응형 레이아웃 (모바일 웹 대응)
- [ ] 백엔드: 대화 컨텍스트 최적화 (sliding window 요약)
- [ ] 백엔드: 에러 핸들링 강화
- [ ] AI: 프롬프트 튜닝 + 면책 안내 타이밍 조정
- [ ] 테스트: 주요 플로우 통합 테스트
