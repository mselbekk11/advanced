'use client';

import { CalendarDays } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';
import { Input } from '@/components/ui/input';

// A US-format (MM/DD/YYYY) date field. The browser's own date input shows the
// viewer's locale format (DD/MM/YYYY outside the US), so the doctor types into
// a text field instead and the calendar button opens the native picker.
// The form value stays an ISO date (YYYY-MM-DD), or '' while incomplete.

type Props = Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'onChange' | 'type'> & {
  value: string;
  onChange: (iso: string) => void;
  min?: string;
};

export function isoToUs(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[2]}/${m[3]}/${m[1]}` : '';
}

export function usToIso(us: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(us);
  if (!m) return '';
  const [, mm, dd, yyyy] = m;
  const d = new Date(Date.UTC(+yyyy, +mm - 1, +dd));
  // Rejects dates that roll over, like 02/30/2026.
  if (d.getUTCFullYear() !== +yyyy || d.getUTCMonth() !== +mm - 1 || d.getUTCDate() !== +dd) return '';
  return `${yyyy}-${mm}-${dd}`;
}

// Inserts the slashes as the doctor types digits: 1020 → 10/20.
function formatTyped(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
}

export const DueDateInput = forwardRef<HTMLInputElement, Props>(function DueDateInput(
  { value, onChange, min, disabled, ...props },
  ref
) {
  const [text, setText] = useState(() => isoToUs(value));
  const pickerRef = useRef<HTMLInputElement>(null);

  // Follow outside changes (form reset, the picker) without clobbering typing.
  useEffect(() => {
    if (usToIso(text) !== value) setText(isoToUs(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className='relative'>
      <Input
        ref={ref}
        type='text'
        inputMode='numeric'
        autoComplete='off'
        placeholder='MM/DD/YYYY'
        maxLength={10}
        disabled={disabled}
        className='pr-10'
        {...props}
        value={text}
        onChange={(e) => {
          const next = formatTyped(e.target.value);
          setText(next);
          onChange(usToIso(next));
        }}
      />
      <button
        type='button'
        disabled={disabled}
        aria-label='Open calendar'
        className='absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50'
        onClick={() => {
          const picker = pickerRef.current;
          if (!picker) return;
          try {
            picker.showPicker();
          } catch {
            picker.focus();
          }
        }}
      >
        <CalendarDays className='h-4 w-4' />
      </button>
      {/* Native picker, visually hidden; only its calendar popup is used. */}
      <input
        ref={pickerRef}
        type='date'
        tabIndex={-1}
        aria-hidden
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='pointer-events-none absolute bottom-0 right-0 h-0 w-0 opacity-0'
      />
    </div>
  );
});
