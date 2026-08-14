export function AppLogo({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="techpath-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(16 185 129)" />
          <stop offset="1" stopColor="rgb(20 184 166)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#techpath-logo-grad)" />
      {/* stylised winding path from a start node to a destination node - the TechPath motif */}
      <path
        d="M7 25C7 25 12 25 14 20C16 15 20 16 21 12C22 8 25 8 25 7"
        stroke="#04120d"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="7" cy="25" r="2.4" fill="#04120d" />
      <circle cx="25" cy="7" r="2.4" fill="#04120d" />
    </svg>
  );
}
