export default function ChatAvatar({ size = "large" }: { size?: "large" | "small" }) {
  const sizeClasses = size === "large" ? "w-14 h-14" : "w-8 h-8";

  return (
    <svg
      viewBox="0 0 200 200"
      className={`${sizeClasses} rounded-full`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="100" fill="#f3f4f6" />

      {/* Head */}
      <circle cx="100" cy="80" r="45" fill="#f8d7a1" />

      {/* Hair */}
      <path
        d="M 55 80 Q 55 45 100 40 Q 145 45 145 80"
        fill="#2c1810"
      />

      {/* Eyes */}
      <circle cx="80" cy="75" r="8" fill="#1f2937" />
      <circle cx="120" cy="75" r="8" fill="#1f2937" />

      {/* Eye sparkles */}
      <circle cx="82" cy="73" r="3" fill="#ffffff" />
      <circle cx="122" cy="73" r="3" fill="#ffffff" />

      {/* Smile */}
      <path
        d="M 80 95 Q 100 110 120 95"
        stroke="#1f2937"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Nose */}
      <path
        d="M 100 80 L 100 92"
        stroke="#d4a574"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Cheeks blush */}
      <circle cx="65" cy="90" r="6" fill="#ffb3ba" opacity="0.6" />
      <circle cx="135" cy="90" r="6" fill="#ffb3ba" opacity="0.6" />

      {/* Neck */}
      <rect x="85" y="120" width="30" height="20" fill="#f8d7a1" />

      {/* Body */}
      <path
        d="M 70 145 L 50 200 L 150 200 L 130 145 Z"
        fill="#7c3aed"
      />

      {/* Shirt detail */}
      <circle cx="85" cy="160" r="5" fill="#ffffff" opacity="0.3" />
      <circle cx="115" cy="160" r="5" fill="#ffffff" opacity="0.3" />
    </svg>
  );
}
