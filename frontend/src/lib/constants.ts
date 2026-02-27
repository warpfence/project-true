/** 애플리케이션 상수 정의 */

/** 면책 문구 */
export const DISCLAIMER_TEXT =
  "본 서비스는 AI가 제공하는 참고용 상담이며, 전문가의 실제 상담을 대체하지 않습니다. 중요한 결정은 반드시 해당 분야 전문가와 상의하세요.";

/** 메시지 글자 수 제한 */
export const MAX_MESSAGE_LENGTH = 2000;

/** 전문가 분야 목록 */
export const EXPERT_TYPES = {
  career: {
    label: "취업",
    icon: "💼",
    color: "blue",
    title: "취업 상담",
    desc: "이력서 첨삭부터 면접 준비까지, AI 커리어 코치가 도와드려요.",
    colorHex: "#4A6FA5",
    bgFrom: "#E8EEF6",
    bgTo: "#D4DEF0",
  },
  love: {
    label: "연애",
    icon: "💕",
    color: "pink",
    title: "연애 상담",
    desc: "썸·연애·이별, 복잡한 마음을 함께 정리해 드려요.",
    colorHex: "#C4697C",
    bgFrom: "#FAEAED",
    bgTo: "#F2D4DA",
  },
  fortune: {
    label: "사주",
    icon: "🔮",
    color: "purple",
    title: "사주 상담",
    desc: "사주·운세·궁합, 오늘의 운세부터 인생 흐름까지 풀어드려요.",
    colorHex: "#7B61A6",
    bgFrom: "#EDE5F5",
    bgTo: "#DDD0EE",
  },
  parenting: {
    label: "육아",
    icon: "👶",
    color: "green",
    title: "육아 상담",
    desc: "육아 고민, 혼자 끙끙대지 마세요. AI 육아 전문가가 함께해요.",
    colorHex: "#5A9E6F",
    bgFrom: "#E4F2E8",
    bgTo: "#CEE8D5",
  },
} as const;

/** 온보딩 3단계 이용 안내 */
export const ONBOARDING_STEPS = [
  { num: "1", title: "분야 선택", desc: "상담받고 싶은 분야를 골라요" },
  { num: "2", title: "고민 입력", desc: "카톡 보내듯 편하게 이야기해요" },
  { num: "3", title: "AI 상담", desc: "전문가 수준의 맞춤 답변을 받아요" },
] as const;

/** 채팅 미리보기 목업 데이터 */
export const CHAT_PREVIEW_MESSAGES = [
  { role: "ai" as const, content: "안녕하세요! 😊 취업 관련 고민이 있으시군요. 어떤 부분이 가장 걱정되세요?" },
  { role: "user" as const, content: "이력서 자기소개서를 어떻게 써야 할지 모르겠어요..." },
  { role: "ai" as const, content: "충분히 어려우실 수 있어요. 지원하시려는 직무와 경험을 알려주시면, 맞춤 첨삭을 도와드릴게요 ✨" },
] as const;

/** 브랜드 컬러 */
export const BRAND_COLORS = {
  navy: "#2B3A55",
  cream: "#FDFAF5",
  gold: "#F5E6C8",
  accentBlue: "#4A6FA5",
  accentPurple: "#7B61A6",
  navyLight: "#3D5278",
  blueLight: "#5A7FB5",
} as const;

/** 프로젝트 정보 */
export const PROJECT_NAME = "AI 전문가 상담";
export const PROJECT_DESCRIPTION =
  "생성형 AI 전문가에게 부담 없이 상담받아 보세요.";

/** 사이드바 메뉴 */
export const SIDEBAR_MENU = [
  { href: "/main/start", label: "시작하기", icon: "Play" },
  { href: "/main/history", label: "나의 상담 이력", icon: "History" },
  { href: "/main/help", label: "도움말", icon: "HelpCircle" },
  { href: "/main/account", label: "계정 정보", icon: "User" },
] as const;
