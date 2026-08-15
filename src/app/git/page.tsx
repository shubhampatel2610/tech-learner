import type { Metadata } from 'next';
import { GitTrackView } from '@/components/module/GitTrackView';

export const metadata: Metadata = {
  title: 'Git in 7 Days',
  description:
    'Seven days, one hour each, to actually understand what Git is doing under the hood - not just which commands to paste.',
};

export default function GitPage() {
  return <GitTrackView />;
}
