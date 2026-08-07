import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/modules/auth/auth.store';
import { installMockApi } from '@/shared/api/mock-adapter';
import { env } from '@/shared/config/env';

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
            itemBg: 'transparent',
            itemColor: '#475569',
            itemHoverColor: '#0f172a',
            itemHoverBg: '#f1f5f9',
            itemSelectedColor: '#2563eb',
            itemSelectedBg: '#f1f5f9',
            groupTitleColor: '#94a3b8',
            groupTitleFontSize: 11,
            activeBarWidth: 0,
            itemMarginInline: 8,
            itemBorderRadius: 8,
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
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}
