import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Compact bordered surface used throughout the learning UI. */
export function SectionCard({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}) {
  return <Tag className={cn('card p-4 sm:p-5', className)}>{children}</Tag>;
}
