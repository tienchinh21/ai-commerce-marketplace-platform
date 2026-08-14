import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import viVN from 'antd/locale/vi_VN';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/modules/auth/auth.store';
import { ThemeProvider, useTheme } from '@/shared/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function AntConfigProvider({ children }: { children: ReactNode }) {
  const { isDark } = useTheme();

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? '#3b82f6' : '#2563eb',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          colorBgContainer: isDark ? '#1e293b' : '#ffffff',
          colorBgLayout: isDark ? '#0f172a' : '#f8fafc',
          colorBorder: isDark ? '#334155' : '#e2e8f0',
          colorText: isDark ? '#f8fafc' : '#0f172a',
          colorTextSecondary: isDark ? '#94a3b8' : '#64748b',
        },
        components: {
          Menu: {
            itemBg: 'transparent',
            itemColor: isDark ? '#94a3b8' : '#475569',
            itemHoverColor: isDark ? '#ffffff' : '#0f172a',
            itemHoverBg: isDark ? '#334155' : '#f1f5f9',
            itemSelectedColor: isDark ? '#60a5fa' : '#2563eb',
            itemSelectedBg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#f1f5f9',
            groupTitleColor: isDark ? '#64748b' : '#94a3b8',
            groupTitleFontSize: 11,
            activeBarWidth: 0,
            itemMarginInline: 8,
            itemBorderRadius: 8,
          },
          Card: {
            boxShadowSecondary: isDark
              ? '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)'
              : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          },
          Table: {
            headerBg: isDark ? '#0f172a' : '#f1f5f9',
            headerColor: isDark ? '#cbd5e1' : '#334155',
            headerSplitColor: isDark ? '#334155' : '#e2e8f0',
          },
          Pagination: {
            itemSize: 32,
            borderRadius: 8,
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

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AntConfigProvider>{children}</AntConfigProvider>
    </ThemeProvider>
  );
}
