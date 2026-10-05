import { describe, expect, it } from 'vitest';
import { isoToUs, usToIso } from './DueDateInput';

describe('due date conversion', () => {
  it('converts between MM/DD/YYYY and ISO', () => {
    expect(usToIso('10/20/2026')).toBe('2026-10-20');
    expect(isoToUs('2026-10-20')).toBe('10/20/2026');
    expect(isoToUs('')).toBe('');
  });

  it('rejects incomplete and impossible dates', () => {
    expect(usToIso('10/20/20')).toBe('');
    expect(usToIso('02/30/2026')).toBe('');
    expect(usToIso('13/01/2026')).toBe('');
    expect(usToIso('20/10/2026')).toBe('');
  });
});
