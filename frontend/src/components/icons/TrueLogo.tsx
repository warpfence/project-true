/**
 * TrueLogo SVG 컴포넌트.
 *
 * 브랜드 로고 아이콘. size props로 Nav(28)과 Hero(72) 크기를 구분한다.
 */

interface TrueLogoProps {
  size?: number;
  className?: string;
}

export default function TrueLogo({ size = 28, className }: TrueLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      <circle cx="14" cy="14" r="14" fill="#2B3A55" />
      <path
        d="M9 11.5C9 10.12 10.12 9 11.5 9H16.5C17.88 9 19 10.12 19 11.5V14.5C19 15.88 17.88 17 16.5 17H15L12 20V17H11.5C10.12 17 9 15.88 9 14.5V11.5Z"
        fill="#F5E6C8"
      />
      <circle cx="12.5" cy="13" r="1" fill="#2B3A55" />
      <circle cx="15.5" cy="13" r="1" fill="#2B3A55" />
    </svg>
  );
}
