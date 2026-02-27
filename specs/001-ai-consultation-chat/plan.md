# Implementation Plan: AI 전문가 상담 채팅 서비스

**Branch**: `001-ai-consultation-chat` | **Date**: 2026-02-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-consultation-chat/spec.md`

## Summary

생성형 AI(Gemini API)를 활용한 전문가 상담 채팅 웹앱 구현. 4개 분야(취업, 연애, 사주, 육아)의 AI 전문가가 사용자와 1:1 채팅 상담을 SSE 스트리밍으로 진행하며, Clean Architecture 기반의 FastAPI 백엔드와 Next.js 14 프론트엔드로 구성된다.

## Technical Context

**Language/Version**: Python 3.11+ (Backend), TypeScript 5.x (Frontend)
**Primary Dependencies**:
- Backend: FastAPI 0.115+, SQLAlchemy 2.0+ (async), Pydantic v2, google-genai 1.0+, sse-starlette 2.0+, python-jose, google-auth
- Frontend: Next.js 14.x, React 18.x, Tailwind CSS 3.x, shadcn/ui, next-auth 5.x (Auth.js v5)
**Storage**: PostgreSQL 16 + asyncpg + Alembic (async 마이그레이션)
**Testing**: pytest + httpx (Backend), Jest + React Testing Library (Frontend)
**Target Platform**: Docker 컨테이너 (Linux), 웹 브라우저 (데스크톱/모바일)
**Project Type**: Web Application (Frontend + Backend + Database)
**Performance Goals**: AI 응답 첫 글자 <3초, 페이지 로드 <2초, SSE keepalive 15초
**Constraints**: 메시지 2000자 제한, 한국어 전용, Google OAuth 인증 필수
**Scale/Scope**: 개인 프로젝트 규모, 동시 사용자 수십 명 수준

## Constitution Check

*GATE: Constitution이 템플릿 상태 (미설정)이므로 게이트 위반 없음. 통과.*

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-consultation-chat/
├── plan.md              # 이 파일
├── spec.md              # 기능 명세서
├── research.md          # 기술 리서치 결과
├── data-model.md        # 데이터 모델 정의
├── quickstart.md        # 개발 환경 설정 가이드
├── contracts/
│   └── api-contracts.md # API 인터페이스 계약
├── checklists/
│   └── requirements.md  # 명세 품질 체크리스트
└── tasks.md             # (Phase 2 - /speckit.tasks에서 생성)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── domain/                      # Domain Layer (Entities + ABC Repositories)
│   │   ├── entities/
│   │   │   ├── user.py              # User 엔티티 (dataclass)
│   │   │   ├── expert.py            # Expert 엔티티
│   │   │   ├── chat_room.py         # ChatRoom 엔티티
│   │   │   └── message.py           # Message 엔티티
│   │   └── repositories/
│   │       ├── user_repository.py   # AbstractUserRepository (ABC)
│   │       ├── expert_repository.py
│   │       ├── chat_room_repository.py
│   │       └── message_repository.py
│   │
│   ├── application/                 # Application Layer (Use Cases + DTOs)
│   │   ├── use_cases/
│   │   │   ├── auth_user.py         # 구글 로그인 처리
│   │   │   ├── start_consultation.py
│   │   │   ├── send_message.py      # 메시지 전송 + AI 스트리밍 응답
│   │   │   ├── get_chat_history.py
│   │   │   ├── get_chat_room_detail.py
│   │   │   ├── summarize_consultation.py
│   │   │   └── get_experts.py
│   │   ├── dto/
│   │   │   ├── auth_dto.py
│   │   │   ├── chat_dto.py
│   │   │   └── user_dto.py
│   │   └── interfaces/
│   │       └── ai_client.py         # AIClient ABC (Gemini 추상화)
│   │
│   ├── infrastructure/              # Infrastructure Layer
│   │   ├── persistence/
│   │   │   ├── database.py          # async engine + session factory
│   │   │   ├── models.py            # SQLAlchemy ORM 모델
│   │   │   └── repositories/
│   │   │       ├── user_repo_impl.py
│   │   │       ├── expert_repo_impl.py
│   │   │       ├── chat_room_repo_impl.py
│   │   │       └── message_repo_impl.py
│   │   ├── external/
│   │   │   ├── gemini_client.py     # AIClient 구현 (google-genai)
│   │   │   └── google_auth.py       # Google ID Token 검증
│   │   └── config/
│   │       └── settings.py          # Pydantic Settings
│   │
│   ├── presentation/                # Presentation Layer
│   │   ├── api/
│   │   │   ├── auth_router.py
│   │   │   ├── expert_router.py
│   │   │   ├── chat_router.py
│   │   │   └── user_router.py
│   │   ├── middleware/
│   │   │   └── auth_middleware.py    # JWT 인증
│   │   └── dependencies.py          # FastAPI DI (Depends 체이닝)
│   │
│   └── main.py                      # FastAPI 앱 진입점
│
├── alembic/
│   ├── versions/
│   └── env.py                       # async 마이그레이션 설정
├── alembic.ini
├── seed/
│   └── seed_experts.py              # 전문가 시드 데이터
├── tests/
├── requirements.txt
├── Dockerfile
└── .env.example

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # 루트 레이아웃
│   │   ├── page.tsx                 # 온보딩 랜딩 페이지
│   │   ├── globals.css
│   │   ├── providers.tsx            # SessionProvider 래퍼
│   │   ├── main/
│   │   │   ├── layout.tsx           # 메인 레이아웃 (헤더+사이드바+콘텐츠)
│   │   │   ├── start/page.tsx       # 시작하기 (전문가 선택)
│   │   │   ├── history/page.tsx     # 나의 상담 이력
│   │   │   ├── chat/[roomId]/page.tsx  # 채팅방
│   │   │   ├── help/page.tsx        # 도움말
│   │   │   └── account/page.tsx     # 계정 정보
│   │   └── api/auth/[...nextauth]/route.ts
│   │
│   ├── auth.ts                      # NextAuth v5 설정 (Google Provider + JWT 콜백)
│   ├── middleware.ts                # 라우트 보호 미들웨어
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui 컴포넌트 (npx shadcn@latest add로 설치)
│   │   ├── onboarding/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── IntroSection.tsx
│   │   │   └── CategorySection.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── chat/
│   │   │   ├── ChatRoom.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   ├── SummaryCard.tsx
│   │   │   └── DisclaimerBanner.tsx
│   │   ├── expert/
│   │   │   └── ExpertCard.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── hooks/
│   │   ├── useChat.ts              # SSE 스트리밍 + 메시지 상태 관리
│   │   ├── useAuth.ts
│   │   ├── useChatRooms.ts
│   │   └── useExperts.ts
│   │
│   ├── services/
│   │   ├── api.ts                  # Axios/fetch 인스턴스
│   │   ├── authService.ts
│   │   ├── chatService.ts
│   │   ├── expertService.ts
│   │   └── userService.ts
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── expert.ts
│   │   ├── chat.ts
│   │   └── message.ts
│   │
│   └── lib/
│       └── constants.ts            # 면책 문구 등 상수
│
├── public/images/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile

docker-compose.yml                   # DB + Backend + Frontend
.env.example                         # 환경 변수 템플릿
```

**Structure Decision**: Web Application 구조 선택. PROJECT_SPEC.md에 명시된 백엔드(FastAPI)/프론트엔드(Next.js) 분리 아키텍처를 따르며, Clean Architecture 4-Layer 구조로 백엔드를 구성한다.

## Key Technical Decisions

### TD-001: SSE 스트리밍

- `sse-starlette` EventSourceResponse 사용 (W3C SSE 자동 준수, disconnect 감지, keepalive ping 내장)
- 프론트엔드: `fetch` + `ReadableStream` 수동 파싱 (EventSource의 JWT 헤더 미지원 문제 해결)
- 상세: [research.md#R-001](./research.md)

### TD-002: 인증 아키텍처

- NextAuth v5(Auth.js)가 Google OAuth 처리 → jwt() 콜백에서 ID Token 캡처
- 서버사이드에서 FastAPI로 ID Token 전달 → FastAPI가 google-auth로 검증 후 자체 JWT 발급
- JWT(Access 30분 + Refresh 7일)는 NextAuth 세션 내 httpOnly 쿠키로 저장
- 상세: [research.md#R-002](./research.md)

### TD-003: Clean Architecture DI 패턴

- FastAPI `Depends()` 체이닝: `get_session → get_repository → get_use_case`
- Domain 레이어: 순수 Python dataclass + ABC (외부 의존성 없음)
- Infrastructure: SQLAlchemy 2.0 async + `expire_on_commit=False`
- 상세: [research.md#R-003](./research.md)

### TD-004: Gemini API 통합

- `google-genai` SDK의 `client.aio.models.generate_content_stream()` 사용
- system_prompt(전문가별) + 대화 이력 + 새 메시지를 컨텍스트로 전달
- 모델: `gemini-2.0-flash`

### TD-005: UI 컴포넌트 라이브러리 (shadcn/ui)

- shadcn/ui를 사용하여 일관된 디자인 시스템 구축 (Radix UI + Tailwind CSS 기반)
- 필요한 컴포넌트만 선택적으로 설치 (`npx shadcn@latest add`)하여 번들 크기 최적화
- 주요 사용 컴포넌트: Button, Card, Input, Textarea, Avatar, ScrollArea, Sheet, Skeleton, Badge, DropdownMenu
- `components/ui/` 디렉토리에 설치되어 커스터마이징 가능

## Complexity Tracking

> Constitution이 미설정 상태이므로 위반 사항 없음. Clean Architecture의 4-Layer 구조는 PROJECT_SPEC.md에서 명시적으로 요구된 사항임.
