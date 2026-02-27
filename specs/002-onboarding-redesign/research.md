# Research: 온보딩 랜딩 페이지 리디자인

**Feature Branch**: `002-onboarding-redesign`
**Date**: 2026-02-27

## R-001: Intersection Observer를 활용한 스크롤 진입 애니메이션

**Decision**: 브라우저 네이티브 Intersection Observer API 기반 커스텀 훅 (`useInView`) 구현

**Rationale**:
- 프로젝트에 추가 패키지 설치 없이 구현 가능 (제약 조건 충족)
- `tailwindcss-animate`가 이미 설치되어 있으므로, CSS transition + JS 트리거 조합으로 충분
- 시안(`onboarding-landing.jsx`)에 이미 동일한 패턴이 구현되어 있어 검증됨
- threshold 파라미터로 섹션별 트리거 타이밍 조절 가능

**Alternatives Considered**:
- `framer-motion`: 강력하지만 번들 사이즈 증가 (~30KB), 추가 패키지 설치 필요 → 제약 위반
- `react-intersection-observer` 라이브러리: 편의성 높으나, 단순한 사용에 외부 의존성 불필요
- CSS `@scroll-timeline`: 브라우저 지원 미비 (2026년 기준 실험적)

---

## R-002: 패럴랙스 효과 구현 방식

**Decision**: `scroll` 이벤트 리스너 (passive) + CSS `transform: translate()` 사용

**Rationale**:
- 시안에서 동일한 방식으로 구현되어 있음 (`scrollY * coefficient`)
- passive listener 사용으로 스크롤 성능 영향 최소화
- GPU 가속이 적용되는 `transform` 속성만 변경하므로 reflow/repaint 없음
- 3개 blob 요소에만 적용하므로 연산 부담 미미

**Alternatives Considered**:
- CSS `background-attachment: fixed`: 모바일 호환성 이슈, 세밀한 제어 불가
- `requestAnimationFrame` 스로틀링: 현재 규모에서는 과도한 최적화, passive listener로 충분
- CSS `@scroll-timeline`: 브라우저 지원 부족

---

## R-003: Tailwind CSS 커스텀 컬러 시스템 통합

**Decision**: `tailwind.config.ts`의 `theme.extend.colors`에 브랜드 컬러 추가 + CSS 변수 병행

**Rationale**:
- 기존 프로젝트가 이미 CSS 변수 기반 shadcn/ui 컬러 시스템을 사용 중
- 브랜드 컬러는 온보딩 전용이므로, `extend`로 추가하여 기존 시스템과 충돌 방지
- 그라데이션은 Tailwind 유틸리티로 표현 어려운 복합 값이므로, 인라인 또는 CSS 변수로 처리

**Alternatives Considered**:
- 모든 스타일을 CSS 모듈로 분리: 프로젝트가 Tailwind 기반이므로 일관성 저하
- styled-components: 추가 패키지 설치 필요 → 제약 위반
- 인라인 스타일만 사용 (시안 방식): 유지보수성 저하, Tailwind 프로젝트와 부조화

---

## R-004: SVG 로고 관리 방식

**Decision**: React 컴포넌트(`TrueLogo.tsx`)로 SVG 인라인 관리, props로 크기/색상 제어

**Rationale**:
- 시안에 2가지 크기(28x28 Nav용, 72x72 Hero용)의 동일한 로고가 사용됨
- 컴포넌트화하면 크기/색상을 props로 재사용 가능
- 외부 SVG 파일보다 번들 최적화 유리 (Next.js 트리쉐이킹 적용)
- `lucide-react` 패턴과 일관된 아이콘 관리 방식

**Alternatives Considered**:
- `public/` 폴더에 SVG 파일: 동적 스타일링 불가, 추가 HTTP 요청
- SVGR 로더: 추가 설정 필요, 현재 프로젝트에 미설정
- 이미지 태그(`<img>`): 색상 변경 불가, 해상도 이슈

---

## R-005: 스크롤 위치 상태 관리

**Decision**: 별도 `useScrollPosition` 훅으로 분리, `useState` + passive `scroll` 이벤트

**Rationale**:
- Nav 배경 전환과 패럴랙스 블롭, 스크롤 인디케이터 3곳에서 `scrollY` 값 필요
- 루트 컴포넌트(`page.tsx`)에서 한 번만 리스닝하고 하위 컴포넌트에 props로 전달
- `useInView`와 역할 분리: `useInView`는 요소별 진입 감지, `useScrollPosition`은 전역 스크롤 위치

**Alternatives Considered**:
- 각 컴포넌트에서 개별 리스닝: 중복 이벤트 리스너, 성능 저하
- Context API로 전역 공유: 현재 규모에서 과도한 추상화
- CSS `scroll()` 함수: 브라우저 지원 부족

---

## R-006: 기존 컴포넌트와의 호환성

**Decision**: 기존 3개 컴포넌트(HeroSection, IntroSection, CategorySection)를 제자리에서 재작성

**Rationale**:
- 기존 컴포넌트는 단순 구조로, 리디자인 시 내부 전면 교체가 효율적
- 파일 위치와 export 인터페이스를 유지하므로, `app/page.tsx`의 import 변경 최소화
- 신규 컴포넌트(Nav, Footer, ChatPreview, ScrollIndicator)는 같은 디렉토리에 추가

**Alternatives Considered**:
- 새 디렉토리(`components/onboarding-v2/`)에 작성: 불필요한 중복, 마이그레이션 부담
- 기존 코드 위에 점진적 수정: 변경 범위가 커서 전면 재작성이 더 깔끔

---

## R-007: prefers-reduced-motion 접근성 대응

**Decision**: `useInView` 훅에서 미디어 쿼리 감지 후 애니메이션 즉시 완료 처리 + Tailwind `motion-reduce` 유틸리티 활용

**Rationale**:
- `tailwindcss-animate` 플러그인이 이미 `motion-reduce` variant를 지원
- JS 애니메이션(패럴랙스, 스크롤 인디케이터)은 `matchMedia('(prefers-reduced-motion: reduce)')` 체크로 비활성화
- `useInView`에서 reduced motion 시 `visible`을 즉시 `true`로 설정하여 콘텐츠가 정적으로 표시

**Alternatives Considered**:
- CSS only 대응: JS 기반 애니메이션 제어 불가
- 글로벌 Context: 현재 규모에서 과도
