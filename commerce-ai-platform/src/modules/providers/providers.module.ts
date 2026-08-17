import { Module } from '@nestjs/common';
import { loadEnv } from '../../shared/config/env';
import { EMBEDDING_PROVIDER } from './embedding-provider.interface';
import { LocalEmbeddingProvider } from './local-embedding.provider';
import { OpenAiEmbeddingProvider } from './openai-embedding.provider';
import { CHAT_PROVIDER } from './chat-provider.interface';
import { RuleBasedChatProvider } from './rule-based-chat.provider';

@Module({
  providers: [
    {
      provide: EMBEDDING_PROVIDER,
      useFactory: () => {
        const env = loadEnv();
        if (env.ai.embeddingProvider === 'openai' && env.ai.openAiApiKey) {
          return new OpenAiEmbeddingProvider(
            env.ai.openAiApiKey,
            env.ai.embeddingModel,
            env.ai.embeddingDimension,
          );
        }
        return new LocalEmbeddingProvider(env.ai.embeddingDimension);
      },
    },
    { provide: CHAT_PROVIDER, useClass: RuleBasedChatProvider },
  ],
  exports: [EMBEDDING_PROVIDER, CHAT_PROVIDER],
})
export class ProvidersModule {}
