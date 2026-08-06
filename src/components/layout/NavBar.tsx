'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_LINKS, APP, ROUTES } from '@/lib/appConstants';
import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/lib/utils';

export function NavBar() {
  const pathname = usePathname();
  const scrolled = useScrolled(240);

  const isActive = (href: string) =>
    href === ROUTES.home ? pathname === '/' : pathname.startsWith(href);

  /** Topic pages are long - once scrolled, surface a way back without hunting for the in-page link. */
  const showBack = scrolled && pathname.startsWith('/topics/');

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full items-center gap-4 px-4 sm:px-6 lg:px-8 xl:px-12">
        <AnimatePresence initial={false}>
          {showBack && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 32 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <Link
                href={ROUTES.home}
                aria-label="Back to all topics"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-muted transition-colors hover:border-accent/40 hover:text-text"
              >
                <i className="pi pi-arrow-left text-xs" aria-hidden />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <Link href={ROUTES.home} className="flex items-center gap-2">
          <AppLogo />
          <span className="text-sm font-semibold text-text">{APP.name}</span>
        </Link>

        <nav className="ml-2 flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                isActive(link.href)
                  ? 'bg-surface-2 text-text'
                  : 'text-muted hover:text-text',
              )}
            >
              <i className={`${link.icon} text-[11px]`} aria-hidden />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={APP.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-2 text-muted transition-colors hover:text-text sm:flex"
            aria-label="GitHub repository"
          >
            <i className="pi pi-github text-sm" aria-hidden />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
