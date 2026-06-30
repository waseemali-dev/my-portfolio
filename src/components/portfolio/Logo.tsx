interface LogoProps {
  className?: string;
  useGradient?: boolean;
  strokeWidth?: number;
}

export function Logo({ className = "w-8 h-8", useGradient = true, strokeWidth = 8 }: LogoProps) {
  const gradientId = useGradient ? "logo-grad" : undefined;
  return (
    <svg
      viewBox="0 0 94 70"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {useGradient && (
        <defs>
          <linearGradient id="logo-grad" x1="16" y1="20" x2="78" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06B6D4" /> {/* Primary Cyan */}
            <stop offset="100%" stopColor="#67E8F9" /> {/* Accent Light Cyan */}
          </linearGradient>
        </defs>
      )}
      {/* Stroke 1: Left parallel leg of W */}
      <path
        d="M 16.5 20 L 31.5 50"
        stroke={gradientId ? `url(#${gradientId})` : "currentColor"}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
      />
      {/* Stroke 2, 3, 4: Connected V and A chevron */}
      <path
        d="M 32.5 20 L 47.5 50 L 62.5 20 L 77.5 50"
        stroke={gradientId ? `url(#${gradientId})` : "currentColor"}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
