/** A relationship value is an id or a populated document, depending on depth */
export function relationId(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (value && typeof value === 'object' && 'id' in value) {
    return String(value.id);
  }
  return undefined;
}
