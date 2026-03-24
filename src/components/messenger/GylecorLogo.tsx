interface GylecorLogoProps {
  size?: number;
  className?: string;
}

export default function GylecorLogo({ size = 48, className = "" }: GylecorLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>

      {/* Outer rounded square background */}
      <rect x="4" y="4" width="92" height="92" rx="28" fill="url(#logoGrad1)" />

      {/* Inner glow layer */}
      <rect x="6" y="6" width="88" height="88" rx="26" fill="url(#logoGrad2)" opacity="0.3" />

      {/* Letter G stylized */}
      <path
        d="M 55 30 
           A 22 22 0 1 0 55 70
           L 55 55 L 68 55"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Dot accent */}
      <circle cx="72" cy="30" r="5" fill="white" opacity="0.9" />
    </svg>
  );
}
