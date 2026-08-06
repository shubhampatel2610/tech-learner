import { APP } from '@/lib/appConstants';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="flex w-full flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-faint sm:flex-row sm:px-6 lg:px-8 xl:px-12">
        <p>
          {APP.name} v{APP.version} · Built for learning, not for shipping to prod as-is.
        </p>
        <p>Data structures & algorithms, visualized.</p>
      </div>
    </footer>
  );
}
