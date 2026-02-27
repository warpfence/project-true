# PRD: 온보딩 랜딩 페이지 리디자인

## 1. 개요

### 1.1 배경
현재 온보딩 페이지는 기본적인 Tailwind CSS + shadcn/ui 카드 기반의 심플한 레이아웃으로 구성되어 있다.
기능적으로는 동작하지만, 시각적 몰입감과 브랜딩이 부족하여 사용자의 첫 인상과 전환율 개선이 필요하다.

### 1.2 목표
- `onboarding-landing.jsx` 디자인 시안을 기반으로 현재 Next.js/TypeScript 프로젝트에 적용
- 브랜드 아이덴티티(TRUE) 강화 및 시각적 완성도 향상
- 스크롤 인터랙션, 패럴랙스, Intersection Observer 애니메이션 도입
- 모바일/데스크톱 반응형 대응

---

## 2. 현재 상태 (AS-IS)

### 2.1 페이지 구조
| 컴포넌트 | 파일 | 현재 상태 |
|----------|------|-----------|
| 메인 페이지 | `app/page.tsx` | HeroSection + IntroSection + CategorySection + Footer |
| Hero | `components/onboarding/HeroSection.tsx` | 이모지(🤖) + 제목 + 설명 + 버튼 (정적) |
| Intro | `components/onboarding/IntroSection.tsx` | 3개 기능 카드 (💬🔒📋) 그리드 |
| Category | `components/onboarding/CategorySection.tsx` | 4개 분야 shadcn Card 그리드 |
| Footer | `app/page.tsx` 내 인라인 | 면책 문구 1줄 |

### 2.2 주요 한계
- 애니메이션/인터랙션 없음 (정적 페이지)
- 브랜드 로고/아이콘 없음 (이모지만 사용)
- 컬러 시스템이 Tailwind 기본 gray 계열로 단조로움
- Nav바 없음 (스크롤 시 컨텍스트 상실)
- 채팅 미리보기 등 서비스 체험 요소 없음

---

## 3. 목표 상태 (TO-BE)

### 3.1 디자인 시안 기반 변경 사항

`onboarding-landing.jsx`에서 도출한 핵심 변경 사항:

#### 3.1.1 전역 변경
| 항목 | 현재 | 변경 후 |
|------|------|---------|
| 배경색 | `white → gray-50` 그라데이션 | `#FDFAF5` (크림 톤) 기반 웜 컬러 시스템 |
| 폰트 | 시스템 기본 | Pretendard 우선 적용 |
| 메인 컬러 | Tailwind gray-900 | `#2B3A55` (네이비) |
| 액센트 컬러 | 없음 | `#4A6FA5` (블루), `#7B61A6` (퍼플) 그라데이션 |

#### 3.1.2 Floating Navigation (신규)
- 스크롤 60px 이상 시 배경 blur 효과 활성화
- 브랜드 SVG 로고 아이콘 + "TRUE" 텍스트
- `position: fixed`, 반투명 배경 (`rgba(253,250,245,0.92)`)

#### 3.1.3 Hero Section 리디자인
| 항목 | 현재 | 변경 후 |
|------|------|---------|
| 로고 | 🤖 이모지 | SVG 커스텀 로고 (72x72, 네이비 원형 + 말풍선) |
| 제목 | "AI 전문가 상담" | "마음이 복잡할 땐, **AI 전문가**에게 물어보세요" |
| 부제 | 설명 2줄 | "24시간, 부담 없이, 나만의 전문 상담사" |
| CTA | shadcn Button | 그라데이션 배경 pill 버튼 + 말풍선 SVG 아이콘 |
| CTA 하단 | 없음 | "Google 계정으로 3초 만에 시작" 안내 문구 |
| 배경 | 없음 | 패럴랙스 블롭 3개 (크림/블루/핑크 그라데이션) |
| 높이 | `min-h-[60vh]` | `min-h-screen` (100vh) |
| 애니메이션 | 없음 | Intersection Observer fadeIn + translateY |
| 스크롤 가이드 | 없음 | 하단 스크롤 인디케이터 (마우스 모양 + 바운스 애니메이션) |

#### 3.1.4 Intro Section 리디자인
| 항목 | 현재 | 변경 후 |
|------|------|---------|
| 태그 | 없음 | "서비스 소개" 태그 배지 |
| 제목 | "AI 전문가에게..." | 동일 (유지) |
| 설명 | 1줄 | "카톡처럼 편하게, 전문가처럼 깊게..." 2줄 |
| 기능 카드 | 3개 (💬🔒📋) | 3단계 스텝 카드 (1→2→3) + 화살표 연결 |
| 스텝 내용 | 실시간AI/안전/요약 | "분야 선택 → 고민 입력 → AI 상담" |
| 채팅 미리보기 | 없음 | 목업 채팅 UI (AI 취업 코치 대화 예시) |
| 배경 | `bg-gray-50` | 크림 → 베이지 그라데이션 |
| 애니메이션 | 없음 | 스크롤 기반 fadeIn + stagger delay |

#### 3.1.5 Category Section 리디자인
| 항목 | 현재 | 변경 후 |
|------|------|---------|
| 태그 | 없음 | "상담 분야" 태그 배지 |
| 제목 | "4개 분야 전문가" | "어떤 고민이든, 맞는 전문가가 있어요" |
| 카드 스타일 | shadcn Card (흰색) | 분야별 고유 그라데이션 배경 |
| 카드 구성 | icon + label + 텍스트 | emoji + title + 상세 desc |
| 카드 인터랙션 | 없음 | hover 시 translateY(-6px) + 그림자 강화 |
| 카드 색상 | 단일 흰색 | 취업(블루), 연애(핑크), 사주(퍼플), 육아(그린) 그라데이션 |
| 설명 텍스트 | 짧은 나열 | 서비스 특화 문구 (이력서 첨삭, 썸/이별 등) |
| 레이아웃 | `grid 1/2/4col` | `auto-fit, minmax(200px, 1fr)` |

#### 3.1.6 Footer 리디자인
| 항목 | 현재 | 변경 후 |
|------|------|---------|
| 배경 | 투명 + 상단 border | `#F3EFE8` (웜 베이지) |
| 로고 | 없음 | SVG 로고 + "TRUE" 브랜드명 |
| 면책 문구 | 텍스트만 | 배경 있는 배지 스타일 (⚠️ 아이콘 포함) |
| 저작권 | 없음 | "© 2026 TRUE. All rights reserved." |

---

## 4. 기술 요구사항

### 4.1 애니메이션 시스템
- **Intersection Observer 커스텀 훅** (`useInView`): 요소가 뷰포트에 진입 시 애니메이션 트리거
  - threshold 조정 가능 (Hero: 0.1, Cards: 0.08, 기본: 0.15)
  - 한 번만 트리거 (재사용 시 재진입 X)
- **Stagger 애니메이션**: 카드/스텝 순차 등장 (`transitionDelay` 활용)
- **패럴랙스 블롭**: `scroll` 이벤트 기반 `transform: translate()` (passive listener)
- **스크롤 인디케이터**: CSS keyframe 바운스 애니메이션
- **Hover 인터랙션**: CTA 버튼, 분야 카드에 hover 시 scale/shadow 변화

### 4.2 스타일링 방식
- 기존 프로젝트의 **Tailwind CSS** 기반 유지
- 시안의 inline style 객체를 Tailwind 유틸리티 클래스 + CSS 모듈/커스텀 CSS로 변환
- Tailwind config에 커스텀 컬러 추가:
  ```
  brand-navy: #2B3A55
  brand-cream: #FDFAF5
  brand-gold: #F5E6C8
  ```
- SVG 로고는 별도 컴포넌트로 분리

### 4.3 컴포넌트 구조 (변경 계획)
```
components/onboarding/
├── OnboardingNav.tsx          # 신규: Floating Navigation
├── HeroSection.tsx            # 리디자인: 로고 + 패럴랙스 + CTA
├── IntroSection.tsx           # 리디자인: 스텝 + 채팅 미리보기
├── CategorySection.tsx        # 리디자인: 그라데이션 카드
├── OnboardingFooter.tsx       # 신규: 브랜드 Footer
├── ChatPreview.tsx            # 신규: 채팅 목업 UI
├── ScrollIndicator.tsx        # 신규: 스크롤 가이드
└── hooks/
    └── useInView.ts           # 신규: Intersection Observer 훅
```

### 4.4 반응형 대응
- 시안의 `clamp()` 기반 폰트 사이징 유지
- 스텝 카드: 데스크톱 가로 배치 → 모바일 세로 스택
- 카테고리 카드: `auto-fit, minmax(200px, 1fr)` 자동 반응형
- Nav: 모바일에서도 동일한 레이아웃 유지 (로고만 표시)

### 4.5 기존 기능 유지
- Google OAuth 로그인 (`signIn("google")`) 동작 유지
- `EXPERT_TYPES`, `DISCLAIMER_TEXT` 등 기존 상수 활용
- Next.js App Router 구조 유지 (`app/page.tsx` → 컴포넌트 조합)

---

## 5. 데이터 매핑

### 5.1 카테고리 데이터 (시안 → 기존 상수 매핑)
| 시안 | 기존 `EXPERT_TYPES` | 추가 필요 데이터 |
|------|---------------------|-----------------|
| 취업 상담 (💼, #4A6FA5) | career (💼, blue) | desc, color hex, bg gradient |
| 연애 상담 (💕, #C4697C) | love (💕, pink) | desc, color hex, bg gradient |
| 사주 상담 (🔮, #7B61A6) | fortune (🔮, purple) | desc, color hex, bg gradient |
| 육아 상담 (👶, #5A9E6F) | parenting (👶, green) | desc, color hex, bg gradient |

### 5.2 상수 확장 필요
`EXPERT_TYPES`에 다음 필드 추가:
- `desc`: 카드 설명 텍스트
- `colorHex`: 실제 hex 컬러값
- `bgGradient`: 카드 배경 그라데이션

---

## 6. 구현 범위

### 6.1 In Scope
- [x] Floating Navigation 컴포넌트 신규 개발
- [x] Hero Section 전면 리디자인 (SVG 로고, 패럴랙스, CTA)
- [x] Intro Section 리디자인 (스텝 카드, 채팅 미리보기)
- [x] Category Section 리디자인 (그라데이션 카드, hover 효과)
- [x] Footer 리디자인 (브랜드 로고, 저작권)
- [x] `useInView` 커스텀 훅 구현
- [x] 스크롤 인디케이터 구현
- [x] Tailwind 커스텀 컬러 설정
- [x] 반응형 디자인 (모바일/태블릿/데스크톱)

### 6.2 Out of Scope
- 로그인 후 페이지 (`/main/*`) 디자인 변경
- 백엔드 API 변경
- 다크 모드 지원
- i18n/다국어 지원
- 웹폰트(Pretendard) CDN 추가 (별도 작업)

---

## 7. 영향 분석

### 7.1 수정 대상 파일
| 파일 | 변경 유형 |
|------|----------|
| `app/page.tsx` | 수정: Nav/Footer 컴포넌트 추가, 배경색 변경 |
| `components/onboarding/HeroSection.tsx` | 전면 재작성 |
| `components/onboarding/IntroSection.tsx` | 전면 재작성 |
| `components/onboarding/CategorySection.tsx` | 전면 재작성 |
| `lib/constants.ts` | 수정: EXPERT_TYPES 필드 확장 |
| `tailwind.config.ts` | 수정: 커스텀 컬러/키프레임 추가 |

### 7.2 신규 생성 파일
| 파일 | 설명 |
|------|------|
| `components/onboarding/OnboardingNav.tsx` | Floating Navigation |
| `components/onboarding/OnboardingFooter.tsx` | 브랜드 Footer |
| `components/onboarding/ChatPreview.tsx` | 채팅 목업 |
| `components/onboarding/ScrollIndicator.tsx` | 스크롤 가이드 |
| `hooks/useInView.ts` | Intersection Observer 훅 |
| `components/icons/TrueLogo.tsx` | SVG 로고 컴포넌트 |

### 7.3 의존성
- 추가 패키지 불필요 (Intersection Observer는 브라우저 네이티브 API)
- 기존 shadcn/ui `Button` 사용 여부 검토 (커스텀 CTA로 대체 가능)

---

## 8. 참고

- **디자인 시안**: `frontend_edit/onboarding-landing.jsx`
- **현재 코드**: `frontend/src/components/onboarding/`
- **프로젝트 기술 스택**: Next.js 14 + React 18 + TypeScript + Tailwind CSS + shadcn/ui
