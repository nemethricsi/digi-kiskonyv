import { describe, expect, it } from 'vitest';

import { formatTaj, isValidTaj, normalizeTaj } from '@/lib/taj';

describe('isValidTaj', () => {
  it.each(['111111110', '000000000', '123456788'])('accepts %s', (taj) => {
    expect(isValidTaj(taj)).toBe(true);
  });

  it.each([
    ['wrong check digit', '111111111'],
    ['too short', '11111111'],
    ['too long', '1111111100'],
    ['non-digit', '11111111a'],
    ['separators (not normalized)', '111 111 110'],
    ['empty', ''],
  ])('rejects %s', (_, taj) => {
    expect(isValidTaj(taj)).toBe(false);
  });
});

describe('formatTaj', () => {
  it.each([
    ['', ''],
    ['111', '111'],
    ['1111', '111 1'],
    ['111111', '111 111'],
    ['111111110', '111 111 110'],
  ])('formats %j as %j', (input, expected) => {
    expect(formatTaj(input)).toBe(expected);
  });
});

describe('normalizeTaj', () => {
  it('strips spaces and dashes', () => {
    expect(normalizeTaj('111 111-110')).toBe('111111110');
  });
});
