/** A single "value + label" stat, used in track hero banners (DSA, Git). */
export function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-base font-semibold text-text">{value}</span>
      <span>{label}</span>
    </div>
  );
}
