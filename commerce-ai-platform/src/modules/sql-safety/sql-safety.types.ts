export type SqlSafetyStatus =
  | 'ALLOWED'
  | 'EMPTY_SQL'
  | 'NOT_SELECT'
  | 'BLOCKED_MUTATION'
  | 'UNSAFE_TABLE'
  | 'MISSING_LIMIT';

export interface SqlSafetyResult {
  allowed: boolean;
  status: SqlSafetyStatus;
  reasons: string[];
  normalizedSql?: string;
}
