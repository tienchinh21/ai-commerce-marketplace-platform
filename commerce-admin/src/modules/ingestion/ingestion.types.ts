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

export interface DataSourcePayload {
  name: string;
  type?: string;
  baseUrl?: string | null;
  status?: string;
  configJson?: Record<string, unknown>;
}

export type UpdateDataSourcePayload = Partial<DataSourcePayload>;

export interface ImportProductItem {
  sourceProductId: string;
  title: string;
  sellerId: string;
  categoryId: string;
  priceMin?: number;
  priceMax?: number;
  brand?: string | null;
  description?: string | null;
  specs?: Record<string, unknown>;
}

export interface ImportProductsPayload {
  dataSourceId: string;
  items: ImportProductItem[];
}

export interface ImportReviewItem {
  sourceReviewId: string;
  sourceProductId: string;
  productId: string;
  buyerId?: string | null;
  sellerId?: string | null;
  rating: number;
  title?: string | null;
  content?: string | null;
}

export interface ImportReviewsPayload {
  dataSourceId: string;
  items: ImportReviewItem[];
}

export interface CreatedResourceResponse {
  success: true;
  id: string;
  message: string;
}

export interface MutationSuccessResponse {
  success: true;
  message: string;
}

export interface ImportRunResponse {
  success: boolean;
  syncRunId: string;
  status: string;
  totalRecords: number;
  successCount: number;
  failedCount: number;
  message: string;
}
