# Implementation Plan: 온보딩 랜딩 페이지 리디자인

**Branch**: `002-onboarding-redesign` | **Date**: 2026-02-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-onboarding-redesign/spec.md`

## Summary

현재 정적이고 단조로운 온보딩 랜딩 페이지를 브랜드 아이덴티티(TRUE)가 반영된 시각적 완성도 높은 페이지로 리디자인한다. 히어로 섹션에 패럴랙스 배경과 SVG 로고를 도입하고, Intersection Observer 기반 스크롤 애니메이션, 채팅 미리보기 목업, 분야별 그라데이션 카드를 구현한다. 기존 Next.js 14 + Tailwind CSS + shadcn/ui 스택 위에서 추가 의존성 없이 구현한다.

## Technical Context

**Language/Version**: TypeScript 5.x / React 18 / Next.js 14 (App Router)
**Primary Dependencies**: Tailwind CSS 3.4, tailwindcss-animate, shadcn/ui (Radix), lucide-react
**Storage**: N/A (프론트엔드 전용 변경, 백엔드/DB 무관)
**Testing**: 수동 브라우저 테스트 (E2E 프레임워크 미도입 상태)
**Target Platform**: Web (모바일 375px ~ 초대형 2560px+)
**Project Type**: Web Application (Frontend Only)
**Performance Goals**: 60fps 스크롤 애니메이션, 3초 이내 페이지 로드
**Constraints**: 추가 패키지 설치 없음, 기존 인증 흐름 유지, standalone 빌드 호환
**Scale/Scope**: 온보딩 페이지 1개 (`/`), 컴포넌트 ~10개 수정/생성

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution이 프로젝트에 아직 설정되지 않음 (템플릿 상태). 프로젝트 CLAUDE.md의 기존 원칙을 기준으로 검증:

| 원칙 | 상태 | 비고 |
|------|------|------|
| Clean Architecture 의존성 방향 | PASS | 프론트엔드 전용 변경, 백엔드 레이어 미접촉 |
| 기존 컨벤션 준수 | PASS | TypeScript, PascalCase 컴포넌트, `@/` 절대 경로 유지 |
| 환경 변수 하드코딩 금지 | PASS | 디자인 상수는 코드 내 정의 (환경 의존 아님) |
| 한글 주석/에러 메시지 | PASS | 한글로 작성 |

**GATE 결과**: PASS — Phase 0 진행 가능

## Project Structure

### Documentation (this feature)

```text
specs/002-onboarding-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
frontend/src/
├── app/
│   └── page.tsx                          # 수정: Nav/Footer 추가, 배경색 변경
├── components/
│   ├── icons/
│   │   └── TrueLogo.tsx                  # 신규: SVG 브랜드 로고 컴포넌트
│   ├── onboarding/
│   │   ├── OnboardingNav.tsx             # 신규: Floating Navigation
│   │   ├── HeroSection.tsx               # 재작성: 패럴랙스, SVG 로고, CTA
│   │   ├── IntroSection.tsx              # 재작성: 스텝 카드, 채팅 미리보기
│   │   ├── CategorySection.tsx           # 재작성: 그라데이션 카드
│   │   ├── OnboardingFooter.tsx          # 신규: 브랜드 Footer
│   │   ├── ChatPreview.tsx              # 신규: 채팅 목업 UI
│   │   └── ScrollIndicator.tsx          # 신규: 스크롤 가이드
│   └── ui/                               # 기존 shadcn/ui (변경 없음)
├── hooks/
│   ├── useInView.ts                      # 신규: Intersection Observer 훅
│   └── useScrollPosition.ts             # 신규: 스크롤 위치 훅
├── lib/
│   └── constants.ts                      # 수정: EXPERT_TYPES 확장, 브랜드 컬러 추가
└── globals.css                           # 수정: 커스텀 keyframe, 브랜드 CSS 변수

frontend/
└── tailwind.config.ts                    # 수정: 커스텀 컬러, keyframe 추가
```

**Structure Decision**: 기존 프로젝트 구조를 그대로 유지하며, `components/onboarding/` 하위에 신규 컴포넌트 추가. `hooks/` 디렉토리에 범용 훅 추가. `components/icons/`에 SVG 로고 분리.

## Complexity Tracking

> Constitution 위반 사항 없음. 이 섹션은 비워둠.
