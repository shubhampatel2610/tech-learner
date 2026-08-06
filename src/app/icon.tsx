import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/**
 * Favicon, generated at build/request time from the same node-graph motif as
 * `AppLogo` (three linked nodes = the DSA theme) so the browser tab matches
 * the in-app brand mark exactly, with no separately-maintained binary asset.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <svg width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgb(16,185,129)" />
            <stop offset="1" stopColor="rgb(20,184,166)" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#grad)" />
        <circle cx="10" cy="11" r="2.6" fill="#04120d" />
        <circle cx="22" cy="11" r="2.6" fill="#04120d" />
        <circle cx="16" cy="22" r="2.6" fill="#04120d" />
        <path d="M10 11L22 11M10 11L16 22M22 11L16 22" stroke="#04120d" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    { ...size },
  );
}
