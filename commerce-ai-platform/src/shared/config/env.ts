export interface AiEnv {
  port: number;
  nodeEnv: string;
  corsOrigins: string[];
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    synchronize: boolean;
  };
  ai: {
    embeddingProvider: 'local' | 'openai';
    embeddingModel: string;
    embeddingDimension: number;
    openAiApiKey?: string;
  };
}

export function loadEnv(): AiEnv {
  return {
    port: Number(process.env.PORT ?? 3001),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    db: {
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      user: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      name: process.env.DB_NAME ?? 'commerce',
      synchronize: process.env.DB_SYNCHRONIZE !== 'false',
    },
    ai: {
      embeddingProvider:
        process.env.EMBEDDING_PROVIDER === 'openai' ? 'openai' : 'local',
      embeddingModel:
        process.env.EMBEDDING_MODEL ??
        (process.env.EMBEDDING_PROVIDER === 'openai'
          ? 'text-embedding-3-small'
          : 'local-hash-embedding-v1'),
      embeddingDimension: Number(process.env.EMBEDDING_DIMENSION ?? 64),
      openAiApiKey: process.env.OPENAI_API_KEY,
    },
  };
}
