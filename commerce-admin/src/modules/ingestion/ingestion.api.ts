import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { PageResponse } from '@/shared/types/pagination';
import type {
  CreatedResourceResponse,
  DataSourcePayload,
  DataSource,
  ImportProductsPayload,
  ImportReviewsPayload,
  ImportRunResponse,
  MutationSuccessResponse,
  RawSnapshot,
  RawSnapshotListParams,
  SyncRun,
  SyncRunListParams,
  UpdateDataSourcePayload,
} from './ingestion.types';

export async function fetchDataSources(): Promise<DataSource[]> {
  const response = await coreApi.get<DataSource[]>(cmsPath('/data-sources'));
  return response.data;
}

export async function fetchDataSourceDetail(id: string): Promise<DataSource> {
  const response = await coreApi.get<DataSource>(cmsPath(`/data-sources/${id}`));
  return response.data;
}

export async function createDataSource(payload: DataSourcePayload): Promise<CreatedResourceResponse> {
  const response = await coreApi.post<CreatedResourceResponse>(cmsPath('/data-sources'), payload);
  return response.data;
}

export async function updateDataSource(
  id: string,
  payload: UpdateDataSourcePayload,
): Promise<MutationSuccessResponse> {
  const response = await coreApi.patch<MutationSuccessResponse>(cmsPath(`/data-sources/${id}`), payload);
  return response.data;
}

export async function fetchSyncRuns(params: SyncRunListParams = {}): Promise<PageResponse<SyncRun>> {
  const response = await coreApi.get<PageResponse<SyncRun>>(cmsPath('/sync-runs'), { params });
  return response.data;
}

export async function fetchSyncRunDetail(id: string): Promise<SyncRun> {
  const response = await coreApi.get<SyncRun>(cmsPath(`/sync-runs/${id}`));
  return response.data;
}

export async function fetchRawSnapshots(params: RawSnapshotListParams = {}): Promise<PageResponse<RawSnapshot>> {
  const response = await coreApi.get<PageResponse<RawSnapshot>>(cmsPath('/raw-snapshots'), { params });
  return response.data;
}

export async function fetchRawSnapshotDetail(id: string): Promise<RawSnapshot> {
  const response = await coreApi.get<RawSnapshot>(cmsPath(`/raw-snapshots/${id}`));
  return response.data;
}

export async function importProducts(payload: ImportProductsPayload): Promise<ImportRunResponse> {
  const response = await coreApi.post<ImportRunResponse>(cmsPath('/imports/products'), payload);
  return response.data;
}

export async function importReviews(payload: ImportReviewsPayload): Promise<ImportRunResponse> {
  const response = await coreApi.post<ImportRunResponse>(cmsPath('/imports/reviews'), payload);
  return response.data;
}
