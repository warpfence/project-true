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
  },
  love: {
    label: "연애",
    icon: "💕",
    color: "pink",
  },
  fortune: {
    label: "사주",
    icon: "🔮",
    color: "purple",
  },
  parenting: {
    label: "육아",
    icon: "👶",
    color: "green",
  },
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
