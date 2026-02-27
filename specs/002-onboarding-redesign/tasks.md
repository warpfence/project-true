# Tasks: 온보딩 랜딩 페이지 리디자인

**Feature Branch**: `002-onboarding-redesign`
**Date**: 2026-02-27

## Phase 1: Setup — 기반 설정

- [x] **T001**: Tailwind 커스텀 컬러 및 keyframe 설정 (`tailwind.config.ts`)
- [x] **T002**: 글로벌 CSS 변수 및 keyframe 추가 (`globals.css`)
- [x] **T003**: 상수 확장 — EXPERT_TYPES 필드 추가 + 브랜드 컬러 상수 (`constants.ts`)

## Phase 2: Core — 공통 훅 및 아이콘

- [x] **T004**: useInView 훅 구현 (`hooks/useInView.ts`) [P]
- [x] **T005**: useScrollPosition 훅 구현 (`hooks/useScrollPosition.ts`) [P]
- [x] **T006**: TrueLogo SVG 컴포넌트 구현 (`components/icons/TrueLogo.tsx`) [P]

## Phase 3: Components — 온보딩 컴포넌트 구현

- [x] **T007**: OnboardingNav 컴포넌트 구현 (`components/onboarding/OnboardingNav.tsx`)
- [x] **T008**: ScrollIndicator 컴포넌트 구현 (`components/onboarding/ScrollIndicator.tsx`)
- [x] **T009**: HeroSection 재작성 (`components/onboarding/HeroSection.tsx`)
- [x] **T010**: ChatPreview 컴포넌트 구현 (`components/onboarding/ChatPreview.tsx`)
- [x] **T011**: IntroSection 재작성 (`components/onboarding/IntroSection.tsx`)
- [x] **T012**: CategorySection 재작성 (`components/onboarding/CategorySection.tsx`)
- [x] **T013**: OnboardingFooter 컴포넌트 구현 (`components/onboarding/OnboardingFooter.tsx`)

## Phase 4: Integration — 페이지 조립

- [x] **T014**: 온보딩 페이지 조립 (`app/page.tsx`)

## Phase 5: Validation — 빌드 검증

- [x] **T015**: 빌드 검증 및 린트 체크
