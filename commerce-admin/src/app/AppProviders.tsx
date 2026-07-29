import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import type { ReactNode } from 'react';
import { AuthProvider } from '../modules/auth/auth.store';
import { installMockApi } from '../shared/api/mock-adapter';
import { env } from '../shared/config/env';

if (env.useMockApi) {
  installMockApi();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}
