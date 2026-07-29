import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
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
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563eb', // Blue-600 corporate clean primary
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f8fafc',
        },
        components: {
          Menu: {
            darkItemBg: '#0f172a',
            darkSubMenuItemBg: '#020617',
            darkItemSelectedBg: '#2563eb',
            darkItemSelectedColor: '#ffffff',
            darkItemHoverBg: '#1e293b',
          },
          Card: {
            boxShadowSecondary: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          },
          Table: {
            headerBg: '#f1f5f9',
            headerColor: '#334155',
            headerSplitColor: '#e2e8f0',
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}
