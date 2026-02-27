# Quickstart: 온보딩 랜딩 페이지 리디자인

**Feature Branch**: `002-onboarding-redesign`
**Date**: 2026-02-27

## 사전 요구사항

- Node.js 18+
- Docker & Docker Compose (전체 서비스 실행 시)
- Git

## 개발 환경 설정

### 1. 브랜치 전환

```bash
git checkout 002-onboarding-redesign
```

### 2. 프론트엔드 의존성 설치

```bash
cd frontend
npm install
```

### 3. 개발 서버 실행

```bash
# 프론트엔드만 (온보딩 페이지 개발 시)
cd frontend && npm run dev
# → http://localhost:3000

# 전체 서비스 (Docker Compose)
docker compose up --build
# → Frontend: http://localhost:3000
# → Backend: http://localhost:8000
```

### 4. 온보딩 페이지 확인

- 브라우저에서 `http://localhost:3000` 접속
- 비로그인 상태에서 온보딩 랜딩 페이지가 표시됨
- 로그인 후에는 `/main/start`로 리다이렉트되므로, 시크릿 모드로 테스트 권장

## 수정 대상 파일 목록

### 수정 파일
| 파일 | 변경 내용 |
|------|----------|
| `frontend/src/app/page.tsx` | Nav/Footer 컴포넌트 추가, 배경/레이아웃 변경 |
| `frontend/src/components/onboarding/HeroSection.tsx` | 전면 재작성 |
| `frontend/src/components/onboarding/IntroSection.tsx` | 전면 재작성 |
| `frontend/src/components/onboarding/CategorySection.tsx` | 전면 재작성 |
| `frontend/src/lib/constants.ts` | EXPERT_TYPES 필드 확장, 브랜드 컬러 상수 추가 |
| `frontend/tailwind.config.ts` | 커스텀 컬러, keyframe 추가 |

### 신규 파일
| 파일 | 설명 |
|------|------|
| `frontend/src/components/icons/TrueLogo.tsx` | SVG 브랜드 로고 컴포넌트 |
| `frontend/src/components/onboarding/OnboardingNav.tsx` | Floating Navigation |
| `frontend/src/components/onboarding/OnboardingFooter.tsx` | 브랜드 Footer |
| `frontend/src/components/onboarding/ChatPreview.tsx` | 채팅 목업 UI |
| `frontend/src/components/onboarding/ScrollIndicator.tsx` | 스크롤 가이드 |
| `frontend/src/hooks/useInView.ts` | Intersection Observer 훅 |
| `frontend/src/hooks/useScrollPosition.ts` | 스크롤 위치 훅 |

## 검증 방법

### 반응형 테스트
- Chrome DevTools → Device Toolbar
- 375px (모바일), 768px (태블릿), 1280px (데스크톱), 2560px (초대형) 확인

### 애니메이션 테스트
- 스크롤 시 각 섹션 페이드인 확인
- 패럴랙스 블롭 이동 확인
- CTA 버튼, 분야 카드 hover 효과 확인

### 접근성 테스트
- Chrome DevTools → Rendering → `prefers-reduced-motion: reduce` 활성화
- 모든 애니메이션이 비활성화되고 정적 콘텐츠만 표시되는지 확인

### 기능 테스트
- "지금 시작하기" 버튼 클릭 → Google OAuth 로그인 흐름 진입 확인
- 로그인 성공 후 `/main/start`로 리다이렉트 확인

## 디자인 참조

- **시안 파일**: `frontend_edit/onboarding-landing.jsx`
- **PRD**: `frontend_edit/frontend_edit_prd.md`
- **스펙**: `specs/002-onboarding-redesign/spec.md`
