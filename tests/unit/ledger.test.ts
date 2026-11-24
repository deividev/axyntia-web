import { describe, expect, it } from 'vitest';
import { lineNumber } from '../../src/lib/ledger';

describe('lineNumber', () => {
  it('rellena con un cero hasta dos cifras', () => {
    expect([1, 4, 9].map(lineNumber)).toEqual(['01', '04', '09']);
  });

  it('deja intactos los números de dos o más cifras', () => {
    expect(lineNumber(10)).toBe('10');
    expect(lineNumber(123)).toBe('123');
  });

  it('rechaza números que no son de línea', () => {
    for (const n of [0, -1, 1.5, Number.NaN]) expect(() => lineNumber(n)).toThrow(RangeError);
  });
});
