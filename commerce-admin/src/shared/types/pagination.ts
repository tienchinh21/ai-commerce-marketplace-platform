export interface PageRequest {
  page: number;
  pageSize: number;
}

export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
