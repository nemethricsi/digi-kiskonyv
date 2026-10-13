/**
 * Hungarian social security number (TAJ): 9 digits, the last one is a check digit.
 * Check digit = (sum of the first 8 digits weighted 3, 7, 3, 7, …) mod 10.
 */
export function isValidTaj(value: string): boolean {
  if (!/^\d{9}$/.test(value)) {
    return false;
  }

  const digits = [...value].map(Number);
  const sum = digits
    .slice(0, 8)
    .reduce((acc, digit, i) => acc + digit * (i % 2 === 0 ? 3 : 7), 0);

  return sum % 10 === digits[8];
}

/** Strips the usual separators, so "123 456 789" and "123-456-789" are accepted. */
export function normalizeTaj(value: string): string {
  return value.replace(/[\s-]/g, '');
}

/** Display format in groups of three ("111 111 110"); works on partial input too. */
export function formatTaj(value: string): string {
  return value.replace(/(\d{3})(?=\d)/g, '$1 ');
}
