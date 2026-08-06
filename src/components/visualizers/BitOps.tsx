'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const BITS = 8;
const MASK8 = (1 << BITS) - 1; // 0xFF

const bits = (v: number) => Array.from({ length: BITS }, (_, k) => (v >> (BITS - 1 - k)) & 1);

/**
 * Interactive 8-bit register: every AND/OR/XOR/NOT/shift/set/clear/toggle
 * operation from the cheatsheet acts on the same byte, with the changed
 * bit positions flashed - so "x & (x-1) clears the lowest set bit" is
 * something you watch happen rather than trust algebraically.
 */
export function BitOps() {
  const [value, setValue] = useState(0b01011010); // 90
  const [changed, setChanged] = useState<number[]>([]);
  const [note, setNote] = useState('Starting value: 90 (0b01011010). Try an operation below.');
  const [bitIndex, setBitIndex] = useState(3);

  const apply = (next: number, message: string) => {
    const before = bits(value);
    const after = bits(next & MASK8);
    setChanged(before.map((b, i) => (b !== after[i] ? i : -1)).filter((i) => i >= 0));
    setValue(next & MASK8);
    setNote(message);
    setTimeout(() => setChanged([]), 900);
  };

  const setBit = () => apply(value | (1 << bitIndex), `x | (1 << ${bitIndex}) - sets bit ${bitIndex} to 1, leaves the rest untouched.`);
  const clearBit = () => apply(value & ~(1 << bitIndex), `x & ~(1 << ${bitIndex}) - clears bit ${bitIndex} to 0, leaves the rest untouched.`);
  const toggleBit = () => apply(value ^ (1 << bitIndex), `x ^ (1 << ${bitIndex}) - flips bit ${bitIndex}, leaves the rest untouched.`);
  const checkBit = () => {
    const isSet = (value >> bitIndex) & 1;
    setChanged([BITS - 1 - bitIndex]);
    setNote(`(x >> ${bitIndex}) & 1 = ${isSet} - bit ${bitIndex} is currently ${isSet ? 'set' : 'clear'}. No value change - this is a read.`);
    setTimeout(() => setChanged([]), 900);
  };
  const shiftLeft = () => apply(value << 1, `x << 1 - every bit moves left, a 0 enters from the right. Equivalent to x * 2.`);
  const shiftRight = () => apply(value >>> 1, `x >> 1 - every bit moves right, the lowest bit is discarded. Equivalent to x // 2 (floor).`);
  const not = () => apply(~value, `~x - every bit flips. Within 8 bits, ~x = 255 - x.`);
  const clearLowestSetBit = () => apply(value & (value - 1), `x & (x - 1) - clears the lowest set bit. Repeating this counts set bits in O(popcount) instead of O(${BITS}).`);
  const reset = () => {
    setValue(0b01011010);
    setChanged([]);
    setNote('Reset to 90 (0b01011010).');
  };

  const bitArr = bits(value);
  const popcount = bitArr.reduce((s, b) => s + b, 0);
  const isPowerOfTwo = value !== 0 && (value & (value - 1)) === 0;

  return (
    <div className="space-y-3">
      <div className="rounded-card border border-border bg-[#0b0d11] p-4">
        <div className="flex justify-center gap-1.5">
          {bitArr.map((b, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-10 w-8 items-center justify-center rounded-md border font-mono text-sm transition-colors',
                  changed.includes(i)
                    ? 'border-accent bg-accent/20 text-accent'
                    : b === 1
                      ? 'border-accent-2/60 bg-accent-2/10 text-text'
                      : 'border-border-strong bg-surface-2 text-muted',
                )}
              >
                {b}
              </div>
              <span className="font-mono text-[9px] text-faint">{BITS - 1 - i}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-4 font-mono text-xs text-faint">
          <span>decimal: <span className="text-text">{value}</span></span>
          <span>popcount: <span className="text-text">{popcount}</span></span>
          <span>power of 2: <span className="text-text">{isPowerOfTwo ? 'yes' : 'no'}</span></span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <label className="flex items-center gap-1 text-xs text-muted">
          bit
          <input
            type="number"
            min={0}
            max={BITS - 1}
            value={bitIndex}
            onChange={(e) => setBitIndex(Math.min(BITS - 1, Math.max(0, Number(e.target.value))))}
            className="w-12 rounded-md border border-border bg-surface-2 px-1.5 py-1 text-center font-mono text-xs text-text"
          />
        </label>
        {[
          { label: 'Check', fn: checkBit },
          { label: 'Set', fn: setBit },
          { label: 'Clear', fn: clearBit },
          { label: 'Toggle', fn: toggleBit },
        ].map(({ label, fn }) => (
          <button
            key={label}
            onClick={fn}
            className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[
          { label: '<< 1', fn: shiftLeft },
          { label: '>> 1', fn: shiftRight },
          { label: '~x (NOT)', fn: not },
          { label: 'x & (x-1)', fn: clearLowestSetBit },
        ].map(({ label, fn }) => (
          <button
            key={label}
            onClick={fn}
            className="rounded-md border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text"
          >
            {label}
          </button>
        ))}
        <button
          onClick={reset}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-faint transition-colors hover:text-text"
        >
          <i className="pi pi-refresh text-[10px]" aria-hidden /> Reset
        </button>
      </div>

      <p className="min-h-[1.25rem] text-xs text-muted" aria-live="polite">
        {note}
      </p>
    </div>
  );
}
