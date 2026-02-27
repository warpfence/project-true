# Tasks: AI 전문가 상담 채팅 서비스

**Input**: Design documents from `/specs/001-ai-consultation-chat/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: 테스트 태스크는 명세에서 명시적으로 요청되지 않았으므로 포함하지 않음.

**Organization**: 태스크는 사용자 스토리(US1~US7) 기준으로 그룹화되어 독립 구현 및 테스트가 가능함.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (다른 파일, 미완료 태스크에 대한 의존성 없음)
- **[Story]**: 해당 태스크가 속한 사용자 스토리 (예: US1, US2, US3)
- 모든 태스크에 정확한 파일 경로 포함

## Path Conventions

- **Backend**: `backend/app/` (Clean Architecture 4-Layer)
- **Frontend**: `frontend/src/` (Next.js 14 App Router)
- **Infrastructure**: 프로젝트 루트 (`docker-compose.yml`, `.env.example`)

---

## Phase 1: Setup (프로젝트 초기화)

**Purpose**: 백엔드/프론트엔드 프로젝트 구조 생성 및 의존성 설정

- [x] T001 Clean Architecture 디렉토리 구조를 포함한 백엔드 프로젝트 생성 (backend/app/domain/, application/, infrastructure/, presentation/ 및 각 하위 디렉토리에 __init__.py 파일 포함)
- [x] T002 백엔드 의존성 파일 생성: backend/requirements.txt (FastAPI, SQLAlchemy[asyncio], asyncpg, alembic, pydantic[email], pydantic-settings, google-genai, google-auth, python-jose[cryptography], sse-starlette, uvicorn, httpx)
- [x] T003 [P] Next.js 14 App Router 프로젝트 초기화 (frontend/ 디렉토리, TypeScript, Tailwind CSS, src/ 디렉토리 구조 포함), next-auth@5 설치, shadcn/ui 초기화 (npx shadcn@latest init — New York 스타일, CSS variables 사용)
- [x] T004 [P] Docker Compose 파일 생성: docker-compose.yml (db: postgres:16, backend: FastAPI, frontend: Next.js)
- [x] T005 [P] 환경 변수 템플릿 생성: .env.example (DB_PASSWORD, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GEMINI_API_KEY, JWT_SECRET_KEY, AUTH_SECRET, AUTH_URL)

---

## Phase 2: Foundational (기반 인프라)

**Purpose**: 모든 사용자 스토리 구현 전에 반드시 완료해야 하는 핵심 인프라

**⚠️ CRITICAL**: 이 Phase가 완료되어야 사용자 스토리 작업을 시작할 수 있음

### Backend 인프라

- [x] T006 Pydantic Settings 설정 클래스 생성: backend/app/infrastructure/config/settings.py (DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GEMINI_API_KEY, JWT_SECRET_KEY, JWT_ALGORITHM, JWT_EXPIRE_MINUTES)
- [x] T007 SQLAlchemy async 엔진 및 세션 팩토리 설정: backend/app/infrastructure/persistence/database.py (create_async_engine, async_sessionmaker, expire_on_commit=False)
- [x] T008 [P] Domain 엔티티 생성 (dataclass, 외부 의존성 없음): backend/app/domain/entities/user.py, expert.py, chat_room.py, message.py
- [x] T009 [P] Abstract Repository 인터페이스 생성 (ABC): backend/app/domain/repositories/user_repository.py, expert_repository.py, chat_room_repository.py, message_repository.py
- [x] T010 SQLAlchemy ORM 모델 생성 (User, Expert, ChatRoom, Message): backend/app/infrastructure/persistence/models.py (data-model.md 참조, UUID PK, TIMESTAMPTZ, 인덱스 포함)
- [x] T011 Alembic async 마이그레이션 초기화 및 초기 마이그레이션 생성: backend/alembic/ (alembic init -t async, env.py에 target_metadata 설정, alembic revision --autogenerate)
- [x] T012 [P] Repository 구현체 생성: backend/app/infrastructure/persistence/repositories/user_repo_impl.py, expert_repo_impl.py, chat_room_repo_impl.py, message_repo_impl.py (_to_entity 변환 포함)
- [x] T013 FastAPI DI 의존성 체이닝 설정: backend/app/presentation/dependencies.py (get_db_session, get_*_repository, get_*_use_case 함수들)
- [x] T014 JWT 인증 미들웨어 구현: backend/app/presentation/middleware/auth_middleware.py (HTTPBearer, JWT 검증, get_current_user)
- [x] T015 FastAPI 앱 진입점 생성: backend/app/main.py (CORS 설정, 라우터 등록, lifespan 이벤트)
- [x] T016 전문가 시드 데이터 스크립트 생성: backend/seed/seed_experts.py (4개 전문가 데이터 + 시스템 프롬프트 삽입, PROJECT_SPEC.md 6장 참조)

### Frontend 인프라

- [x] T017 [P] TypeScript 타입 정의 생성: frontend/src/types/user.ts, expert.ts, chat.ts, message.ts (API 계약 기반)
- [x] T018 [P] API 클라이언트 기본 설정: frontend/src/services/api.ts (fetch 래퍼, JWT Authorization 헤더 자동 첨부, 에러 처리)
- [x] T019 [P] 상수 정의 파일 생성: frontend/src/lib/constants.ts (면책 문구, 메시지 글자 수 제한 2000자, 전문가 분야 목록)
- [x] T020 글로벌 CSS 설정: frontend/src/app/globals.css (Tailwind 기본 설정, shadcn/ui CSS 변수, 채팅 버블 애니메이션 등)
- [x] T020-1 [P] shadcn/ui 컴포넌트 설치: npx shadcn@latest add button card input textarea avatar scroll-area sheet skeleton badge dropdown-menu separator (frontend/src/components/ui/ 에 설치)
- [x] T021 루트 레이아웃 생성: frontend/src/app/layout.tsx (메타데이터, 폰트, 한국어 lang 설정)

**Checkpoint**: 기반 인프라 완료 — 사용자 스토리 구현 시작 가능

---

## Phase 3: User Story 1 — 구글 로그인으로 서비스 시작 (Priority: P1) 🎯 MVP

**Goal**: 비로그인 사용자가 온보딩 페이지에서 구글 로그인 후 메인 화면에 진입. 재방문 시 자동 로그인.

**Independent Test**: 구글 계정으로 로그인하여 메인 화면(헤더+사이드바+콘텐츠)에 도달하는 것으로 검증.

### Backend 구현

- [x] T022 [P] [US1] Google ID Token 검증 모듈 구현: backend/app/infrastructure/external/google_auth.py (google.oauth2.id_token.verify_oauth2_token, 발급자 검증)
- [x] T023 [P] [US1] 인증 DTO 생성: backend/app/application/dto/auth_dto.py (GoogleLoginRequest, TokenResponse, RefreshRequest)
- [x] T024 [US1] 인증 Use Case 구현: backend/app/application/use_cases/auth_user.py (Google ID Token 검증 → DB upsert → JWT 발급, Refresh Token 갱신)
- [x] T025 [US1] 인증 라우터 구현: backend/app/presentation/api/auth_router.py (POST /api/auth/google, POST /api/auth/refresh, GET /api/auth/me — contracts/api-contracts.md 참조)

### Frontend 구현

- [x] T026 [P] [US1] NextAuth v5 설정: frontend/src/auth.ts (Google Provider, jwt() 콜백에서 id_token 캡처 후 FastAPI로 전달, 토큰 갱신 로직)
- [x] T027 [P] [US1] NextAuth API 라우트 핸들러 생성: frontend/src/app/api/auth/[...nextauth]/route.ts (GET/POST 핸들러 export)
- [x] T028 [US1] 라우트 보호 미들웨어 구현: frontend/src/middleware.ts (비인증 사용자 → 온보딩, 인증 사용자 → /main/start 리다이렉트)
- [x] T029 [US1] SessionProvider 래퍼 생성: frontend/src/app/providers.tsx (NextAuth SessionProvider)
- [x] T030 [US1] 인증 서비스 및 훅 생성: frontend/src/services/authService.ts + frontend/src/hooks/useAuth.ts (세션 상태 관리, 로그인/로그아웃)
- [x] T031 [US1] 온보딩 페이지 기본 구현: frontend/src/app/page.tsx (shadcn Button으로 CTA "지금 시작하기" → signIn("google") 트리거, 하단 면책 문구)
- [x] T032 [US1] 메인 레이아웃 구현: frontend/src/app/main/layout.tsx (상단 헤더 + 왼쪽 사이드바 + 오른쪽 콘텐츠의 3영역 레이아웃)
- [x] T033 [P] [US1] Header 컴포넌트 구현: frontend/src/components/layout/Header.tsx (좌측 프로젝트 이름, 우측 shadcn Avatar + DropdownMenu로 프로필/로그아웃)
- [x] T034 [P] [US1] Sidebar 컴포넌트 구현: frontend/src/components/layout/Sidebar.tsx (shadcn Button variant=ghost로 메뉴 구성, 시작하기/나의 상담 이력/도움말/계정 정보, 활성 메뉴 하이라이트, 모바일: shadcn Sheet)
- [x] T035 [US1] 시작하기 페이지 플레이스홀더 생성: frontend/src/app/main/start/page.tsx (로그인 후 기본 진입 화면)

**Checkpoint**: 구글 로그인 → 메인 화면 진입 플로우 완성. US1 독립 테스트 가능.

---

## Phase 4: User Story 2 — 전문가 선택 및 새 상담 시작 (Priority: P1)

**Goal**: 로그인한 사용자가 4개 분야 전문가 중 선택하여 새 채팅방을 생성하고, AI 인사말을 받는다.

**Independent Test**: 전문가 카드를 선택하면 새 채팅방이 생성되고 AI 인사말이 표시되는 것으로 검증.

### Backend 구현

- [x] T036 [P] [US2] 전문가 조회 Use Case 구현: backend/app/application/use_cases/get_experts.py (전체 목록 + 타입별 조회)
- [x] T037 [P] [US2] 전문가 라우터 구현: backend/app/presentation/api/expert_router.py (GET /api/experts, GET /api/experts/{expert_type})
- [x] T038 [P] [US2] 채팅 DTO 생성: backend/app/application/dto/chat_dto.py (CreateRoomRequest, RoomResponse, RoomListResponse, RoomDetailResponse, MessageResponse, SendMessageRequest)
- [x] T039 [US2] 상담 시작 Use Case 구현: backend/app/application/use_cases/start_consultation.py (expert_type으로 전문가 조회 → 채팅방 생성 → 인사말 메시지 자동 저장)
- [x] T040 [US2] 채팅 라우터 — 채팅방 생성 엔드포인트 구현: backend/app/presentation/api/chat_router.py (POST /api/chat/rooms)

### Frontend 구현

- [x] T041 [P] [US2] 전문가 서비스 및 훅 생성: frontend/src/services/expertService.ts + frontend/src/hooks/useExperts.ts (전문가 목록 조회)
- [x] T042 [P] [US2] 채팅 서비스 생성 (채팅방 생성): frontend/src/services/chatService.ts (createRoom 함수)
- [x] T043 [P] [US2] ExpertCard 컴포넌트 구현: frontend/src/components/expert/ExpertCard.tsx (shadcn Card 기반 — 아이콘, 이름, 설명, 호버 효과, 클릭 → 채팅방 생성)
- [x] T044 [US2] 시작하기 페이지 완성: frontend/src/app/main/start/page.tsx (전문가 4개 카드 그리드, 선택 시 POST /api/chat/rooms → /main/chat/[roomId] 라우팅)

**Checkpoint**: 전문가 선택 → 채팅방 생성 → 채팅방 진입(인사말 표시) 플로우 완성. US2 독립 테스트 가능.

---

## Phase 5: User Story 3 — AI 전문가와 실시간 채팅 상담 (Priority: P1)

**Goal**: 채팅방에서 사용자가 메시지를 보내고 AI 전문가의 응답을 SSE 스트리밍으로 실시간 수신한다.

**Independent Test**: 메시지 전송 → AI 응답 스트리밍 표시 → 대화 맥락 유지를 검증.

### Backend 구현

- [x] T045 [P] [US3] AIClient 추상 인터페이스 정의: backend/app/application/interfaces/ai_client.py (ABC: stream_response 메서드)
- [x] T046 [P] [US3] 4개 전문가 시스템 프롬프트 완성: backend/seed/seed_experts.py 내 system_prompt 필드에 PROJECT_SPEC.md 6장의 공통 규칙 + 분야별 규칙 + 인사말 전체 포함
- [x] T047 [US3] Gemini 클라이언트 구현: backend/app/infrastructure/external/gemini_client.py (google-genai SDK, client.aio.models.generate_content_stream, system_instruction + 대화 이력 + 새 메시지 컨텍스트 전달)
- [x] T048 [US3] 메시지 전송 Use Case 구현: backend/app/application/use_cases/send_message.py (사용자 메시지 DB 저장 → 이전 메시지 이력 조회 → Gemini 스트리밍 호출 → AI 응답 DB 저장)
- [x] T049 [US3] 채팅 라우터 — 메시지 전송 SSE 엔드포인트 구현: backend/app/presentation/api/chat_router.py (POST /api/chat/rooms/{room_id}/messages, sse-starlette EventSourceResponse, ping=15, 에러 이벤트 처리)

### Frontend 구현

- [x] T050 [P] [US3] ChatHeader 컴포넌트 구현: frontend/src/components/chat/ChatHeader.tsx (뒤로가기 버튼, 전문가 이름, 분야 표시)
- [x] T051 [P] [US3] MessageBubble 컴포넌트 구현: frontend/src/components/chat/MessageBubble.tsx (사용자=오른쪽 파란 배경, AI=왼쪽 흰 배경, Tailwind CSS)
- [x] T052 [P] [US3] TypingIndicator 컴포넌트 구현: frontend/src/components/chat/TypingIndicator.tsx (점 3개 bounce 애니메이션)
- [x] T053 [P] [US3] DisclaimerBanner 컴포넌트 구현: frontend/src/components/chat/DisclaimerBanner.tsx (입력창 위 작은 글씨 면책 문구)
- [x] T054 [US3] ChatInput 컴포넌트 구현: frontend/src/components/chat/ChatInput.tsx (shadcn Textarea + Button으로 구성, Enter 키 전송, 빈 메시지 시 전송 비활성화, 2000자 제한 Badge 표시)
- [x] T055 [US3] MessageList 컴포넌트 구현: frontend/src/components/chat/MessageList.tsx (shadcn ScrollArea 기반, 메시지 목록 스크롤, 스마트 자동 스크롤)
- [x] T056 [US3] useChat 훅 구현: frontend/src/hooks/useChat.ts (fetch + ReadableStream SSE 파싱, 메시지 상태 관리, AbortController, 에러/타임아웃 처리, research.md R-004 참조)
- [x] T057 [US3] chatService에 메시지 전송 함수 추가: frontend/src/services/chatService.ts (sendMessage — SSE 스트리밍용 fetch 호출)
- [x] T058 [US3] ChatRoom 컨테이너 컴포넌트 구현: frontend/src/components/chat/ChatRoom.tsx (ChatHeader + MessageList + DisclaimerBanner + ChatInput 조합)
- [x] T059 [US3] 채팅방 페이지 구현: frontend/src/app/main/chat/[roomId]/page.tsx (roomId로 채팅방 정보 로드, ChatRoom 컴포넌트 렌더링)

**Checkpoint**: 메시지 전송 → AI SSE 스트리밍 응답 → 대화 맥락 유지 완성. US3 독립 테스트 가능. 🎯 핵심 MVP 완성.

---

## Phase 6: User Story 4 — 상담 이력 관리 및 이어서 상담하기 (Priority: P2)

**Goal**: 사용자가 과거 상담 목록을 조회하고, 기존 채팅방을 선택하여 이전 대화를 이어서 진행한다.

**Independent Test**: 나의 상담 이력 페이지에서 채팅방 목록 확인 → 기존 채팅방 클릭 → 이전 대화 표시 후 이어서 상담하는 것으로 검증.

### Backend 구현

- [x] T060 [P] [US4] 상담 이력 조회 Use Case 구현: backend/app/application/use_cases/get_chat_history.py (사용자의 채팅방 목록, 최신 순 정렬, 페이지네이션, 마지막 메시지 미리보기)
- [x] T061 [P] [US4] 채팅방 상세 조회 Use Case 구현: backend/app/application/use_cases/get_chat_room_detail.py (채팅방 정보 + 메시지 목록, 소유자 검증, 커서 기반 페이지네이션)
- [x] T062 [US4] 채팅 라우터 — 이력 관련 엔드포인트 추가: backend/app/presentation/api/chat_router.py (GET /api/chat/rooms, GET /api/chat/rooms/{room_id})

### Frontend 구현

- [x] T063 [P] [US4] chatService에 이력 조회 함수 추가: frontend/src/services/chatService.ts (getRooms, getRoomDetail)
- [x] T064 [P] [US4] useChatRooms 훅 구현: frontend/src/hooks/useChatRooms.ts (채팅방 목록 상태 관리, 로딩/에러 처리)
- [x] T065 [P] [US4] EmptyState 컴포넌트 구현: frontend/src/components/common/EmptyState.tsx (이력 없음 안내 + shadcn Button으로 새 상담 시작 유도)
- [x] T066 [US4] 나의 상담 이력 페이지 구현: frontend/src/app/main/history/page.tsx (채팅방 목록, 전문가 이름/아이콘/제목/시간 표시, 클릭 → /main/chat/[roomId], 빈 상태 처리)

**Checkpoint**: 상담 이력 조회 → 기존 채팅 이어서 하기 완성. US4 독립 테스트 가능.

---

## Phase 7: User Story 5 — 상담 마무리 및 요약 생성 (Priority: P2)

**Goal**: 사용자가 종료 신호 시 AI가 상담을 정리하고, 주제/핵심 조언/액션 아이템이 포함된 요약 카드를 생성한다.

**Independent Test**: 종료 신호 전송 → AI 마무리 메시지 → 요약 카드 생성(3항목) → 채팅방 제목 자동 설정을 검증.

### Backend 구현

- [x] T067 [US5] 상담 요약 Use Case 구현: backend/app/application/use_cases/summarize_consultation.py (대화 이력 기반 Gemini 요약 생성 — topic, key_advice, action_items JSON, 채팅방 제목 자동 생성, status → completed 변경)
- [x] T068 [US5] 채팅 라우터 — 요약 관련 엔드포인트 추가: backend/app/presentation/api/chat_router.py (POST /api/chat/rooms/{room_id}/summary, PATCH /api/chat/rooms/{room_id})

### Frontend 구현

- [x] T069 [P] [US5] SummaryCard 컴포넌트 구현: frontend/src/components/chat/SummaryCard.tsx (shadcn Card 기반 — 주제, 핵심 조언 목록, 다음 액션 아이템 목록, Badge로 상태 표시)
- [x] T070 [US5] chatService에 요약 생성 함수 추가: frontend/src/services/chatService.ts (createSummary)
- [x] T071 [US5] 채팅방에 요약 카드 표시 통합: frontend/src/components/chat/ChatRoom.tsx 수정 (상담 완료 시 SummaryCard 렌더링, 요약 생성 트리거 연동)

**Checkpoint**: 상담 종료 → 요약 카드 생성 → 제목 자동 설정 완성. US5 독립 테스트 가능.

---

## Phase 8: User Story 6 — 온보딩 랜딩 페이지 탐색 (Priority: P3)

**Goal**: 비로그인 사용자가 CTA → 서비스 소개 → 상담 분야 소개의 원페이지 스크롤 랜딩 페이지를 탐색한다.

**Independent Test**: 온보딩 페이지의 3개 섹션 스크롤 + 4개 분야 카드 표시 + 하단 면책 문구를 검증.

- [x] T072 [P] [US6] HeroSection 컴포넌트 구현: frontend/src/components/onboarding/HeroSection.tsx (프로젝트 로고, shadcn Button size=lg로 CTA "지금 시작하기", 시각적 임팩트)
- [x] T073 [P] [US6] IntroSection 컴포넌트 구현: frontend/src/components/onboarding/IntroSection.tsx ("AI 전문가에게 부담 없이 상담받아 보세요" 서비스 설명)
- [x] T074 [P] [US6] CategorySection 컴포넌트 구현: frontend/src/components/onboarding/CategorySection.tsx (shadcn Card로 취업/연애/사주/육아 4개 카드, 아이콘/이름/설명)
- [x] T075 [US6] 온보딩 페이지 완성: frontend/src/app/page.tsx (HeroSection + IntroSection + CategorySection 조합, 스크롤 레이아웃, 하단 푸터 면책 문구)

**Checkpoint**: 온보딩 랜딩 페이지 3섹션 원페이지 완성. US6 독립 테스트 가능.

---

## Phase 9: User Story 7 — 도움말 및 계정 정보 관리 (Priority: P3)

**Goal**: 로그인한 사용자가 도움말 페이지를 조회하고, 계정 정보에서 닉네임을 수정한다.

**Independent Test**: 도움말 페이지 표시 + 계정 정보 조회/닉네임 수정을 검증.

### Backend 구현

- [x] T076 [P] [US7] 사용자 DTO 생성: backend/app/application/dto/user_dto.py (UserResponse, UpdateUserRequest)
- [x] T077 [US7] 사용자 라우터 구현: backend/app/presentation/api/user_router.py (GET /api/users/me, PATCH /api/users/me — 닉네임 유효성 검증 포함)

### Frontend 구현

- [x] T078 [P] [US7] 사용자 서비스 생성: frontend/src/services/userService.ts (getMe, updateProfile)
- [x] T079 [P] [US7] 도움말 페이지 구현: frontend/src/app/main/help/page.tsx (서비스 이용 안내 콘텐츠)
- [x] T080 [US7] 계정 정보 페이지 구현: frontend/src/app/main/account/page.tsx (shadcn Avatar, Card, Input으로 프로필 이미지/이메일/닉네임 표시 + 닉네임 수정 폼)

**Checkpoint**: 도움말 + 계정 정보 관리 완성. US7 독립 테스트 가능.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: 여러 사용자 스토리에 걸친 개선 사항

- [x] T081 [P] 에지 케이스 처리: 구글 로그인 취소 시 온보딩 복귀, SSE 네트워크 오류 시 재시도 안내, AI 타임아웃 처리 (spec.md Edge Cases 참조)
- [x] T082 [P] 반응형 레이아웃 적용: frontend/src/app/main/layout.tsx, Sidebar, Header에 모바일 웹 대응 (shadcn Sheet로 사이드바 토글, 반응형 그리드)
- [x] T083 [P] LoadingSpinner 공통 컴포넌트 구현: frontend/src/components/common/LoadingSpinner.tsx (shadcn Skeleton 활용, 페이지/데이터 로딩 시 표시)
- [x] T084 백엔드 에러 핸들링 강화: backend/app/main.py에 글로벌 예외 핸들러 추가 (한글 에러 메시지, 로깅)
- [x] T085 Backend Dockerfile 작성: backend/Dockerfile (Python 3.11, requirements 설치, uvicorn 실행)
- [x] T086 [P] Frontend Dockerfile 작성: frontend/Dockerfile (Node 18, npm build, 프로덕션 실행)
- [x] T087 quickstart.md 검증: Docker Compose 전체 실행 테스트 (DB 마이그레이션, 시드 데이터, 서비스 3개 기동 확인)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 의존성 없음 — 즉시 시작 가능
- **Foundational (Phase 2)**: Setup 완료 후 시작 — **모든 사용자 스토리를 차단**
- **US1 (Phase 3)**: Foundational 완료 후 시작 — US2~US7의 전제 조건 (인증)
- **US2 (Phase 4)**: US1 완료 후 시작 — US3의 전제 조건 (채팅방 생성)
- **US3 (Phase 5)**: US2 완료 후 시작 — 핵심 채팅 기능
- **US4 (Phase 6)**: US3 완료 후 시작 (채팅 이력 필요)
- **US5 (Phase 7)**: US3 완료 후 시작 (채팅 기능 필요), US4와 병렬 가능
- **US6 (Phase 8)**: Foundational 완료 후 시작 — US1과 병렬 가능 (프론트엔드 전용)
- **US7 (Phase 9)**: US1 완료 후 시작 — US4/US5와 병렬 가능
- **Polish (Phase 10)**: 모든 사용자 스토리 완료 후 시작

### User Story Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational
    ↓
Phase 3: US1 (구글 로그인) ←──── Phase 8: US6 (온보딩, 병렬 가능)
    ↓
Phase 4: US2 (전문가 선택) ←──── Phase 9: US7 (도움말/계정, 병렬 가능)
    ↓
Phase 5: US3 (실시간 채팅) ← 🎯 핵심 MVP 완성
    ↓           ↓
Phase 6: US4   Phase 7: US5
(상담 이력)    (상담 요약)   ← 병렬 가능
    ↓           ↓
Phase 10: Polish
```

### Within Each User Story

- DTO/엔티티 → Use Case → 라우터 (백엔드 순서)
- 타입/서비스 → 훅 → 컴포넌트 → 페이지 (프론트엔드 순서)
- 백엔드와 프론트엔드는 같은 스토리 내에서 병렬 진행 가능

### Parallel Opportunities

- Phase 1: T003, T004, T005 병렬 실행
- Phase 2: T008+T009, T012, T017+T018+T019 병렬 실행
- Phase 3: T022+T023, T026+T027, T033+T034 병렬 실행
- Phase 4: T036+T037+T038, T041+T042+T043 병렬 실행
- Phase 5: T045+T046, T050+T051+T052+T053 병렬 실행
- Phase 6: T060+T061, T063+T064+T065 병렬 실행
- Phase 8: T072+T073+T074 병렬 실행 (프론트엔드 전용)
- US4와 US5는 US3 완료 후 병렬 진행 가능
- US6은 Foundational 후 US1과 병렬 진행 가능
- US7은 US1 후 US2/US3와 병렬 진행 가능

---

## Parallel Example: User Story 3 (Phase 5)

```bash
# 백엔드 — 인터페이스와 프롬프트를 먼저 병렬로:
Task: "T045 [P] [US3] AIClient 추상 인터페이스 정의"
Task: "T046 [P] [US3] 4개 전문가 시스템 프롬프트 완성"

# 프론트엔드 — 독립 컴포넌트 병렬로:
Task: "T050 [P] [US3] ChatHeader 컴포넌트"
Task: "T051 [P] [US3] MessageBubble 컴포넌트"
Task: "T052 [P] [US3] TypingIndicator 컴포넌트"
Task: "T053 [P] [US3] DisclaimerBanner 컴포넌트"

# 이후 순차적으로:
Task: "T047 [US3] Gemini 클라이언트 구현" (T045 의존)
Task: "T048 [US3] 메시지 전송 Use Case" (T047 의존)
Task: "T049 [US3] SSE 엔드포인트" (T048 의존)
Task: "T054 [US3] ChatInput 컴포넌트"
Task: "T055 [US3] MessageList 컴포넌트" (T051 의존)
Task: "T056 [US3] useChat 훅"
Task: "T057 [US3] chatService 메시지 전송"
Task: "T058 [US3] ChatRoom 컨테이너" (T050~T055 의존)
Task: "T059 [US3] 채팅방 페이지" (T058 의존)
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3)

1. Phase 1: Setup 완료
2. Phase 2: Foundational 완료 (⚠️ CRITICAL — 모든 스토리 차단)
3. Phase 3: US1 — 구글 로그인 → 메인 화면 진입
4. Phase 4: US2 — 전문가 선택 → 채팅방 생성
5. Phase 5: US3 — 실시간 채팅 상담
6. **STOP and VALIDATE**: 핵심 MVP 독립 테스트
7. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → 기반 완성
2. US1 → 로그인 가능 (최소 가치)
3. US2 + US3 → AI 상담 가능 (**핵심 MVP** 🎯)
4. US4 + US5 → 이력 + 요약 (고급 기능)
5. US6 + US7 → 온보딩 + 설정 (완성도)
6. Polish → 에지 케이스 + 반응형 + Docker

---

## Notes

- [P] 태스크 = 다른 파일 대상, 미완료 태스크에 대한 의존성 없음
- [Story] 라벨로 각 태스크가 어느 사용자 스토리에 속하는지 추적 가능
- 각 사용자 스토리는 Checkpoint에서 독립적으로 완료 및 테스트 가능
- 태스크 또는 논리적 그룹 완료 후 커밋 권장
- 어떤 Checkpoint에서든 멈춰서 해당 스토리를 독립 검증 가능
