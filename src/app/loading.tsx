export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-32 animate-pulse rounded-card border border-border bg-surface-2" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-card border border-border bg-surface-2" />
        ))}
      </div>
    </div>
  );
}
