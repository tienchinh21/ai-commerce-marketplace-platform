export interface DataSource {
  id: string;
  name: string;
  type: string;
  baseUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncRun {
  id: string;
  dataSourceId: string;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  totalRecords: number;
  successCount: number;
  failedCount: number;
  errorSummary: string | null;
  createdAt: string;
}

export interface RawSnapshot {
  id: string;
  dataSourceId: string;
  syncRunId: string | null;
  contentType: string;
  contentHash: string | null;
  objectStorageKey: string | null;
  parseStatus: string;
  errorMessage: string | null;
  createdAt: string;
}

export interface SyncRunListParams {
  dataSourceId?: string;
  page?: number;
  pageSize?: number;
}

export interface RawSnapshotListParams {
  dataSourceId?: string;
  syncRunId?: string;
  page?: number;
  pageSize?: number;
}
