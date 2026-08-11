export function parseJsonObject(input?: string, fallback: Record<string, unknown> = {}): Record<string, unknown> {
  if (!input?.trim()) return fallback;
  const value = JSON.parse(input) as unknown;
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    throw new Error('JSON phải là object.');
  }
  return value as Record<string, unknown>;
}

export function stringifyJsonObject(value: Record<string, unknown> | null | undefined): string {
  return JSON.stringify(value ?? {}, null, 2);
}
