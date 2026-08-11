import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { AnalyticsParams, AnalyticsRecord, ReviewSentimentParams } from './analytics.types';

export async function fetchProductPerformance(params?: AnalyticsParams): Promise<AnalyticsRecord[]> {
  const response = await coreApi.get<AnalyticsRecord[]>(cmsPath('/analytics/product-performance'), { params });
  return response.data;
}

export async function fetchReviewSentiment(params?: ReviewSentimentParams): Promise<AnalyticsRecord[]> {
  const response = await coreApi.get<AnalyticsRecord[]>(cmsPath('/analytics/review-sentiment'), { params });
  return response.data;
}

export async function fetchSellerPerformance(params?: AnalyticsParams): Promise<AnalyticsRecord[]> {
  const response = await coreApi.get<AnalyticsRecord[]>(cmsPath('/analytics/seller-performance'), { params });
  return response.data;
}

export async function fetchCategorySummary(params?: Omit<AnalyticsParams, 'limit'>): Promise<AnalyticsRecord[]> {
  const response = await coreApi.get<AnalyticsRecord[]>(cmsPath('/analytics/category-summary'), { params });
  return response.data;
}
