import Link from 'next/link';
import { ROUTES } from '@/lib/appConstants';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="gradient-text text-6xl font-bold">404</div>
      <h1 className="text-lg font-semibold text-text">Topic not found</h1>
      <p className="max-w-sm text-sm text-muted">
        That page doesn&apos;t exist yet. It may be a roadmap topic that hasn&apos;t been built out.
      </p>
      <Link
        href={ROUTES.home}
        className="rounded-md border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-medium text-accent hover:bg-accent/20"
      >
        <i className="pi pi-arrow-left mr-1 text-[10px]" aria-hidden />Back to roadmap
      </Link>
    </div>
  );
}
