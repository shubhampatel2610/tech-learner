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
        <linearGradient id="dsa-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(16 185 129)" />
          <stop offset="1" stopColor="rgb(20 184 166)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#dsa-logo-grad)" />
      {/* stylised node-graph: three nodes + links, a DSA motif */}
      <circle cx="10" cy="11" r="2.6" fill="#04120d" />
      <circle cx="22" cy="11" r="2.6" fill="#04120d" />
      <circle cx="16" cy="22" r="2.6" fill="#04120d" />
      <path d="M10 11L22 11M10 11L16 22M22 11L16 22" stroke="#04120d" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
