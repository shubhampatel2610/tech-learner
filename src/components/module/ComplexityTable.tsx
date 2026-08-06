import type { ComplexityRow } from '@/types/content.types';

/** Renders a complexity table with color-coded Big-O cells. */
const CLASS_TONE: Record<string, string> = {
  'O(1)': 'text-success',
  'O(log n)': 'text-success',
  'O(n)': 'text-accent',
  'O(n log n)': 'text-accent',
  'O(n + k)': 'text-accent',
  'O(nk)': 'text-warning',
  'O(n²)': 'text-warning',
  'O(2ⁿ)': 'text-danger',
  'O(n!)': 'text-danger',
  'O(V + E)': 'text-accent',
};

function Cell({ value }: { value: string }) {
  return <span className={`font-mono ${CLASS_TONE[value] ?? 'text-muted'}`}>{value}</span>;
}

export function ComplexityTable({ rows }: { rows: ComplexityRow[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-surface-2 text-left text-muted">
            <th className="px-3 py-2 font-semibold">Operation</th>
            <th className="px-3 py-2 font-semibold">Best</th>
            <th className="px-3 py-2 font-semibold">Average</th>
            <th className="px-3 py-2 font-semibold">Worst</th>
            <th className="px-3 py-2 font-semibold">Space</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.operation} className="border-t border-border align-top">
              <td className="px-3 py-2">
                <div className="font-medium text-text">{r.operation}</div>
                {r.note && <div className="mt-0.5 text-[11px] text-faint">{r.note}</div>}
              </td>
              <td className="px-3 py-2"><Cell value={r.best} /></td>
              <td className="px-3 py-2"><Cell value={r.average} /></td>
              <td className="px-3 py-2"><Cell value={r.worst} /></td>
              <td className="px-3 py-2"><Cell value={r.space} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
