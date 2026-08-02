export interface CoreEnv {
  port: number;
  nodeEnv: string;
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    synchronize: boolean;
    seed: boolean;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  corsOrigins: string[];
}

export function loadEnv(): CoreEnv {
  return {
    port: Number(process.env.PORT ?? 8080),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    db: {
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      user: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      name: process.env.DB_NAME ?? 'commerce',
      synchronize: process.env.DB_SYNCHRONIZE !== 'false',
      seed: process.env.DB_SEED !== 'false',
    },
    jwt: {
      secret: process.env.JWT_SECRET ?? 'change-me-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
    },
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  };
}
