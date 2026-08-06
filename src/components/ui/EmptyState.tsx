export function EmptyState({ icon = 'pi pi-inbox', message }: { icon?: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border p-8 text-center">
      <i className={`${icon} text-2xl text-faint`} aria-hidden />
      <p className="max-w-xs text-sm text-muted">{message}</p>
    </div>
  );
}
