import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { AppProviders } from '@/providers/AppProviders';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { APP } from '@/lib/appConstants';

import 'primeicons/primeicons.css';
import './globals.css';

/**
 * Fonts are self-hosted (vendored .woff2) rather than fetched from Google Fonts.
 * This removes a render-blocking third-party request, avoids the GDPR concerns
 * of Google Fonts, and makes builds fully offline-reproducible.
 */
const inter = localFont({
  variable: '--font-inter',
  display: 'swap',
  src: [
    { path: './fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Inter-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/Inter-Bold.woff2', weight: '700', style: 'normal' },
  ],
});

const jetbrains = localFont({
  variable: '--font-mono',
  display: 'swap',
  src: [
    { path: './fonts/JetBrainsMono-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/JetBrainsMono-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/JetBrainsMono-Bold.woff2', weight: '700', style: 'normal' },
  ],
});

export const metadata: Metadata = {
  title: {
    default: `${APP.name} - ${APP.tagline}`,
    template: `%s · ${APP.name}`,
  },
  description: APP.description,
  applicationName: APP.name,
  keywords: ['DSA', 'data structures', 'algorithms', 'Big-O', 'interview prep', 'coding'],
  authors: [{ name: APP.name }],
};

export const viewport: Viewport = {
  themeColor: '#08090c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <AppProviders>
          <NavBar />
          <main className="min-h-[calc(100vh-3.5rem)] w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-12">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
