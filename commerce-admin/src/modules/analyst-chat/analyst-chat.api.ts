import { aiApi, aiPath } from '@/shared/api/http-client';
import type {
  AnalystChatRequest,
  AnalystChatResponse,
} from './analyst-chat.types';

export async function askAnalyst(
  payload: AnalystChatRequest,
): Promise<AnalystChatResponse> {
  const response = await aiApi.post<AnalystChatResponse>(
    aiPath('/analyst/chat'),
    payload,
  );
  return response.data;
}
