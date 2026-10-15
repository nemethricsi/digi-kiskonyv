import { describe, expect, it } from 'vitest';

import {
  CHECK_IN_CODE_LENGTH,
  generateCheckInCode,
  normalizeCheckInCode,
} from '@/lib/check-in-code';

describe('generateCheckInCode', () => {
  it('returns a fixed-length string of digits', () => {
    for (let i = 0; i < 100; i++) {
      expect(generateCheckInCode()).toMatch(
        new RegExp(`^\\d{${CHECK_IN_CODE_LENGTH}}$`),
      );
    }
  });
});

describe('normalizeCheckInCode', () => {
  it.each([
    ['482913', '482913'],
    ['482 913', '482913'],
    ['482-913\n', '482913'],
    ['  048 291 ', '048291'],
  ])('%j → %s', (input, expected) => {
    expect(normalizeCheckInCode(input)).toBe(expected);
  });
});
