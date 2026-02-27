# AI 전문가 상담 채팅 서비스 — 프로젝트 명세

## 프로젝트 개요

생성형 AI(Gemini API)를 활용하여 전문가와 상담하는 웹앱 채팅 서비스입니다.
4개 분야(취업, 연애, 사주, 육아)의 AI 전문가가 사용자와 1:1 채팅 상담을 진행합니다.

## 기술 스택

- **Architecture**: Clean Architecture (4-Layer)
- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Python 3.11+ / FastAPI
- **Database**: PostgreSQL 16 + SQLAlchemy (ORM) + Alembic (Migration)
- **AI Model**: Google Gemini API (`gemini-2.0-flash`)
- **Authentication**: Google OAuth 2.0 (NextAuth.js ↔ FastAPI JWT)
- **Containerization**: Docker + Docker Compose

## 아키텍처 원칙 (Clean Architecture)

의존성 방향: Presentation → Application → Domain (안쪽으로만 의존)

1. **Domain (Entities)**: 비즈니스 모델, Repository 추상 인터페이스. 외부 의존성 없음.
2. **Application (Use Cases)**: 비즈니스 로직 오케스트레이션. Domain에만 의존.
3. **Infrastructure (Interface Adapters)**: DB 구현체, 외부 API 클라이언트. Application/Domain 구현.
4. **Presentation (API/UI)**: FastAPI 라우터, Next.js 페이지. 가장 바깥 레이어.

## 코딩 컨벤션

### Python (Backend)
- Python 3.11+ 타입 힌트 필수
- 함수/변수: snake_case, 클래스: PascalCase
- async/await 사용 (FastAPI 비동기 엔드포인트)
- Pydantic v2 모델 사용 (DTO, 설정)
- docstring은 한글로 작성

### TypeScript (Frontend)
- 컴포넌트: PascalCase, 함수/변수: camelCase
- interface 우선 사용 (type alias는 유니온/인터섹션에만)
- React Server Components 기본, 필요 시에만 'use client'
- 절대 경로 import (`@/components/...`)

### 공통
- 환경 변수는 .env 파일로 관리, 코드에 하드코딩 금지
- 에러 메시지는 한글로 작성
- 주석은 한글로 작성
- Git 커밋 메시지: `feat:`, `fix:`, `refactor:`, `docs:` 접두사 사용
