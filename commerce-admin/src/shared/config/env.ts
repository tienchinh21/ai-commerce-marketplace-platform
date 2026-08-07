export const env = {
  coreApiBaseUrl: import.meta.env.VITE_CORE_API_BASE_URL ?? 'http://localhost:8080/api',
  aiApiBaseUrl: import.meta.env.VITE_AI_API_BASE_URL ?? 'http://localhost:3001',
};
