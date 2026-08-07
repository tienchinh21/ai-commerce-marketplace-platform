import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { PageResponse } from '@/shared/types/pagination';
import type {
  DataSource,
  RawSnapshot,
  RawSnapshotListParams,
  SyncRun,
  SyncRunListParams,
} from './ingestion.types';

export async function fetchDataSources(): Promise<DataSource[]> {
  const response = await coreApi.get<DataSource[]>(cmsPath('/data-sources'));
  return response.data;
}

export async function fetchSyncRuns(params: SyncRunListParams = {}): Promise<PageResponse<SyncRun>> {
  const response = await coreApi.get<PageResponse<SyncRun>>(cmsPath('/sync-runs'), { params });
  return response.data;
}

export async function fetchRawSnapshots(params: RawSnapshotListParams = {}): Promise<PageResponse<RawSnapshot>> {
  const response = await coreApi.get<PageResponse<RawSnapshot>>(cmsPath('/raw-snapshots'), { params });
  return response.data;
}
