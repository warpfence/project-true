# Data Model: 온보딩 랜딩 페이지 리디자인

**Feature Branch**: `002-onboarding-redesign`
**Date**: 2026-02-27

> 이 피처는 프론트엔드 전용 UI 리디자인이므로, 데이터베이스 스키마 변경은 없다.
> 아래는 프론트엔드에서 사용하는 정적 데이터 구조를 정의한다.

## Entity: ExpertCategory (확장)

기존 `EXPERT_TYPES` 상수를 확장하여 온보딩 카드 렌더링에 필요한 필드를 추가한다.

### 현재 구조
```
ExpertType {
  label: string        // "취업"
  icon: string         // "💼"
  color: string        // "blue" (Tailwind 색상명)
}
```

### 확장 구조
```
ExpertType {
  label: string        // "취업" (기존 유지)
  icon: string         // "💼" (기존 유지)
  color: string        // "blue" (기존 유지)
  title: string        // "취업 상담" (카드 제목)
  desc: string         // "이력서 첨삭부터 면접 준비까지..." (카드 설명)
  colorHex: string     // "#4A6FA5" (실제 hex 값)
  bgGradient: string   // "from-blue-50 to-blue-100" (Tailwind 그라데이션)
}
```

### 데이터 값

| key | title | desc | colorHex | bgGradient |
|-----|-------|------|----------|------------|
| career | 취업 상담 | 이력서 첨삭부터 면접 준비까지, AI 커리어 코치가 도와드려요. | #4A6FA5 | 블루 계열 |
| love | 연애 상담 | 썸·연애·이별, 복잡한 마음을 함께 정리해 드려요. | #C4697C | 핑크 계열 |
| fortune | 사주 상담 | 사주·운세·궁합, 오늘의 운세부터 인생 흐름까지 풀어드려요. | #7B61A6 | 퍼플 계열 |
| parenting | 육아 상담 | 육아 고민, 혼자 끙끙대지 마세요. AI 육아 전문가가 함께해요. | #5A9E6F | 그린 계열 |

## Entity: OnboardingStep

소개 섹션의 3단계 이용 안내 데이터.

```
OnboardingStep {
  num: string          // "1", "2", "3"
  title: string        // "분야 선택"
  desc: string         // "상담받고 싶은 분야를 골라요"
}
```

### 데이터 값

| num | title | desc |
|-----|-------|------|
| 1 | 분야 선택 | 상담받고 싶은 분야를 골라요 |
| 2 | 고민 입력 | 카톡 보내듯 편하게 이야기해요 |
| 3 | AI 상담 | 전문가 수준의 맞춤 답변을 받아요 |

## Entity: ChatPreviewMessage

채팅 미리보기 목업의 정적 대화 데이터.

```
ChatPreviewMessage {
  role: "ai" | "user"  // 발신자
  content: string       // 메시지 내용
}
```

### 데이터 값

| role | content |
|------|---------|
| ai | 안녕하세요! 😊 취업 관련 고민이 있으시군요. 어떤 부분이 가장 걱정되세요? |
| user | 이력서 자기소개서를 어떻게 써야 할지 모르겠어요... |
| ai | 충분히 어려우실 수 있어요. 지원하시려는 직무와 경험을 알려주시면, 맞춤 첨삭을 도와드릴게요 ✨ |

## Entity: BrandColors

브랜드 컬러 시스템 상수 정의.

```
BrandColors {
  navy: string         // "#2B3A55" (메인 텍스트/로고)
  cream: string        // "#FDFAF5" (배경)
  gold: string         // "#F5E6C8" (로고 말풍선)
  accentBlue: string   // "#4A6FA5" (액센트)
  accentPurple: string // "#7B61A6" (액센트)
}
```

## 관계도

```
OnboardingPage (page.tsx)
├── OnboardingNav          → BrandColors (로고 색상)
├── HeroSection            → BrandColors (로고, CTA, 블롭)
│   └── ScrollIndicator
├── IntroSection
│   ├── OnboardingStep[]   → 3개 스텝 데이터
│   └── ChatPreview        → ChatPreviewMessage[]
├── CategorySection        → ExpertCategory[] (4개 분야)
└── OnboardingFooter       → BrandColors (로고 색상)
```
