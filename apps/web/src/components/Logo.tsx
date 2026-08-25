// Original Kamakhya Traders logo — an emblem (navy tile with a gold "building"
// mark and red rooftop) beside a two-tone wordmark. Fully owned, no third-party
// marks. Scales cleanly; control size with the `className` height.

export function Logo({ className = 'h-12 w-auto' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 340 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Kamakhya Traders — Building Materials"
    >
      {/* Emblem */}
      <rect x="1.5" y="1.5" width="61" height="61" rx="10" fill="#000917" />
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="10"
        fill="none"
        stroke="#fdbc0a"
        strokeWidth="2.5"
      />
      {/* Red rooftop */}
      <path d="M14 27 L32 13 L50 27 Z" fill="#bb0114" />
      {/* Three pillars (rods / structure) */}
      <rect x="17" y="30" width="7" height="21" rx="1.5" fill="#ffdea3" />
      <rect x="28.5" y="30" width="7" height="21" rx="1.5" fill="#ffffff" />
      <rect x="40" y="30" width="7" height="21" rx="1.5" fill="#ffdea3" />
      {/* Base */}
      <rect x="14" y="52" width="36" height="4" rx="1.5" fill="#fdbc0a" />

      {/* Wordmark */}
      <text
        x="76"
        y="30"
        fontFamily="'Hanken Grotesk', Arial, sans-serif"
        fontSize="24"
        fontWeight="800"
        letterSpacing="-0.5"
      >
        <tspan fill="#000917">KAMAKHYA</tspan>
      </text>
      <text
        x="76"
        y="52"
        fontFamily="'Hanken Grotesk', Arial, sans-serif"
        fontSize="24"
        fontWeight="800"
        letterSpacing="1"
      >
        <tspan fill="#bb0114">TRADERS</tspan>
      </text>
      {/* Small tagline */}
      <text
        x="215"
        y="52"
        fontFamily="'Inter', Arial, sans-serif"
        fontSize="8"
        fontWeight="600"
        letterSpacing="1.5"
        fill="#44474d"
      >
        BUILDING MATERIALS
      </text>
    </svg>
  );
}

// Compact emblem-only mark (for footer, favicons, small spaces).
export function LogoMark({ className = 'h-12 w-12' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Kamakhya Traders"
    >
      <rect x="1.5" y="1.5" width="61" height="61" rx="10" fill="#000917" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="10" fill="none" stroke="#fdbc0a" strokeWidth="2.5" />
      <path d="M14 27 L32 13 L50 27 Z" fill="#bb0114" />
      <rect x="17" y="30" width="7" height="21" rx="1.5" fill="#ffdea3" />
      <rect x="28.5" y="30" width="7" height="21" rx="1.5" fill="#ffffff" />
      <rect x="40" y="30" width="7" height="21" rx="1.5" fill="#ffdea3" />
      <rect x="14" y="52" width="36" height="4" rx="1.5" fill="#fdbc0a" />
    </svg>
  );
}
