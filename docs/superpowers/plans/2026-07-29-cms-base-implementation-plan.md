# CMS Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Base `commerce-admin` thành React/Vite admin CMS chạy được, có layout, auth skeleton, permission menu, API client và các page placeholders để nối Core API dần.

**Architecture:** `commerce-admin` là frontend admin độc lập, không sở hữu business logic và không query database trực tiếp. App dùng route-based modules, shared API clients, auth session store và mock adapter tạm trong development để không bị block khi `commerce-core-service` Java chưa xong.

**Tech Stack:** React + Vite + TypeScript, Ant Design, React Router, TanStack Query, Axios, Vitest, Testing Library.

## Global Constraints

- `commerce-admin` là React + Vite + Ant Design admin CMS.
- Admin là UI/BFF mỏng, không sở hữu business logic.
- Admin không query database trực tiếp.
- Admin gọi `commerce-core-service` cho marketplace data.
- Admin gọi `commerce-ai-platform` cho AI Search, Review Intelligence và AI Analyst sau này.
- Phase base CMS chỉ tạo shell, auth skeleton, API client và page placeholders; không implement core Java, AI Platform hay business rules thật.
- Core Java đang được làm riêng; base CMS phải chạy được bằng mock adapter tạm khi Core API chưa sẵn sàng.
- UI direction là data-operation admin: table/filter/form workflow, gọn, rõ trạng thái, không làm landing page.
- Commit từng task nhỏ, build/test sau mỗi task.

---

## File Structure

Target structure trong `commerce-admin`:

```txt
commerce-admin/
  index.html
  package.json
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  vite.config.ts
  vitest.setup.ts
  Dockerfile
  .env.example
  src/
    main.tsx
    app/
      App.tsx
      AppProviders.tsx
    routes/
      AppRoutes.tsx
      route-permissions.ts
    layouts/
      AdminLayout.tsx
    modules/
      auth/
        auth.api.ts
        auth.store.tsx
        auth.types.ts
        LoginPage.tsx
      dashboard/
        DashboardPage.tsx
      categories/
        CategoriesPage.tsx
        category.api.ts
        category.types.ts
      sellers/
        SellersPage.tsx
      buyers/
        BuyersPage.tsx
      products/
        ProductsPage.tsx
        ProductDetailPage.tsx
      reviews/
        ReviewsPage.tsx
      ingestion/
        IngestionPage.tsx
      ai-search/
        AiSearchPage.tsx
      review-intelligence/
        ReviewIntelligencePage.tsx
      analyst-chat/
        AnalystChatPage.tsx
      users-permissions/
        UsersPermissionsPage.tsx
    shared/
      api/
        http-client.ts
        mock-adapter.ts
      auth/
        PermissionGate.tsx
      components/
        DataPageHeader.tsx
        StatusTag.tsx
      config/
        env.ts
      types/
        pagination.ts
```

---

### Task 1: Scaffold Vite React Admin App

**Files:**
- Modify: `commerce-admin/README.md`
- Create: `commerce-admin/package.json`
- Create: `commerce-admin/index.html`
- Create: `commerce-admin/tsconfig.json`
- Create: `commerce-admin/tsconfig.app.json`
- Create: `commerce-admin/tsconfig.node.json`
- Create: `commerce-admin/vite.config.ts`
- Create: `commerce-admin/vitest.setup.ts`
- Create: `commerce-admin/src/main.tsx`
- Create: `commerce-admin/src/app/App.tsx`
- Create: `commerce-admin/src/app/AppProviders.tsx`
- Create: `commerce-admin/src/shared/config/env.ts`
- Create: `commerce-admin/.env.example`
- Create: `commerce-admin/Dockerfile`

**Interfaces:**
- Consumes: existing `commerce-admin/README.md` and docs in `docs/modules/admin-cms.md`.
- Produces: a buildable React/Vite app and env contract consumed by later tasks.

- [x] **Step 1: Replace README with base setup instructions**

Update `commerce-admin/README.md`:

````markdown
# commerce-admin

React + Vite + Ant Design admin CMS for the AI Commerce Marketplace Platform.

## Responsibilities

- Admin login/session UI.
- Permission-based menu and route guards.
- Marketplace data operation screens.
- Data source/import screens.
- AI Search, Review Intelligence and AI Analyst screens.

## Non-responsibilities

- No business data ownership.
- No direct database access.
- No marketplace business rules beyond UI validation.

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run test
npm run lint
```

## Upstream APIs

- `commerce-core-service`
- `commerce-ai-platform`
````

- [x] **Step 2: Create package.json**

Create `commerce-admin/package.json`:

```json
{
  "name": "commerce-admin",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run --passWithNoTests",
    "test:watch": "vitest",
    "lint": "eslint ."
  },
  "dependencies": {
    "@ant-design/icons": "^5.6.1",
    "@tanstack/react-query": "^5.66.0",
    "antd": "^5.23.4",
    "axios": "^1.7.9",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.1.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.19.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^22.13.1",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.19.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.18",
    "globals": "^15.14.0",
    "jsdom": "^26.0.0",
    "typescript": "~5.7.2",
    "typescript-eslint": "^8.22.0",
    "vite": "^6.1.0",
    "vitest": "^3.0.5"
  }
}
```

- [x] **Step 3: Create TypeScript and Vite config**

Create `commerce-admin/tsconfig.json`:

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }]
}
```

Create `commerce-admin/tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

Create `commerce-admin/tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

Create `commerce-admin/vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
  },
});
```

Create `commerce-admin/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [x] **Step 4: Create HTML and env files**

Create `commerce-admin/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Commerce Admin</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `commerce-admin/.env.example`:

```env
VITE_CORE_API_BASE_URL=http://localhost:8080
VITE_AI_API_BASE_URL=http://localhost:3001
VITE_USE_MOCK_API=true
```

Create `commerce-admin/src/shared/config/env.ts`:

```ts
export const env = {
  coreApiBaseUrl: import.meta.env.VITE_CORE_API_BASE_URL ?? 'http://localhost:8080',
  aiApiBaseUrl: import.meta.env.VITE_AI_API_BASE_URL ?? 'http://localhost:3001',
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false',
};
```

- [x] **Step 5: Create app provider and entrypoint**

Create `commerce-admin/src/app/AppProviders.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConfigProvider>
  );
}
```

Create `commerce-admin/src/app/App.tsx`:

```tsx
import { Typography } from 'antd';

export function App() {
  return <Typography.Title level={3}>Commerce Admin</Typography.Title>;
}
```

Create `commerce-admin/src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { AppProviders } from './app/AppProviders';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
```

- [x] **Step 6: Create Dockerfile**

Create `commerce-admin/Dockerfile`:

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

- [x] **Step 7: Install and verify**

Run:

```bash
cd commerce-admin
npm install
npm run build
npm run test
```

Expected:

```txt
Build succeeds and Vitest exits successfully.
```

- [x] **Step 8: Commit**

Run:

```bash
git add commerce-admin
 git commit -m "feat(admin): scaffold cms app"
```

---

### Task 2: Add Auth Session, API Clients And Mock Adapter

**Files:**
- Create: `commerce-admin/src/shared/api/http-client.ts`
- Create: `commerce-admin/src/shared/api/mock-adapter.ts`
- Create: `commerce-admin/src/modules/auth/auth.types.ts`
- Create: `commerce-admin/src/modules/auth/auth.api.ts`
- Create: `commerce-admin/src/modules/auth/auth.store.tsx`
- Create: `commerce-admin/src/modules/auth/auth.store.test.tsx`
- Modify: `commerce-admin/src/app/AppProviders.tsx`

**Interfaces:**
- Consumes: env values from `shared/config/env.ts`.
- Produces: `coreApi`, `aiApi`, `setAuthToken`, `AuthProvider`, `useAuth`, `login`, `fetchCurrentUser`.

- [x] **Step 1: Create HTTP clients**

Create `commerce-admin/src/shared/api/http-client.ts`:

```ts
import axios from 'axios';
import { env } from '../config/env';

export const coreApi = axios.create({ baseURL: env.coreApiBaseUrl });
export const aiApi = axios.create({ baseURL: env.aiApiBaseUrl });

export function setAuthToken(token: string | null) {
  for (const client of [coreApi, aiApi]) {
    if (token) {
      client.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete client.defaults.headers.common.Authorization;
    }
  }
}
```

- [x] **Step 2: Create mock adapter**

Create `commerce-admin/src/shared/api/mock-adapter.ts`:

```ts
import { coreApi } from './http-client';

export function installMockApi() {
  coreApi.interceptors.request.use((config) => config);
  coreApi.interceptors.response.use(undefined, async (error) => {
    const url = error.config?.url;
    const method = error.config?.method;

    if (method === 'post' && url === '/auth/login') {
      return {
        data: {
          accessToken: 'mock-admin-token',
          user: {
            id: 'mock-admin',
            email: 'admin@example.com',
            displayName: 'Admin',
            permissions: [
              'category:read',
              'seller:read',
              'buyer:read',
              'product:read',
              'review:read',
              'source:read',
              'ai:search',
              'ai:review:analyze',
              'ai:analyst:chat',
            ],
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      };
    }

    return Promise.reject(error);
  });
}
```

- [x] **Step 3: Define auth types**

Create `commerce-admin/src/modules/auth/auth.types.ts`:

```ts
export type PermissionCode =
  | 'product:read'
  | 'product:write'
  | 'review:read'
  | 'review:moderate'
  | 'seller:read'
  | 'seller:write'
  | 'buyer:read'
  | 'buyer:write'
  | 'category:read'
  | 'category:write'
  | 'source:read'
  | 'source:write'
  | 'source:sync'
  | 'ai:search'
  | 'ai:review:analyze'
  | 'ai:analyst:chat';

export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;
  permissions: PermissionCode[];
}

export interface LoginResponse {
  accessToken: string;
  user: CurrentUser;
}
```

- [x] **Step 4: Create auth API**

Create `commerce-admin/src/modules/auth/auth.api.ts`:

```ts
import { coreApi } from '../../shared/api/http-client';
import type { CurrentUser, LoginResponse } from './auth.types';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await coreApi.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const response = await coreApi.get<CurrentUser>('/auth/me');
  return response.data;
}
```

- [x] **Step 5: Write auth store test first**

Create `commerce-admin/src/modules/auth/auth.store.test.tsx`:

```tsx
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './auth.store';

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthProvider', () => {
  beforeEach(() => localStorage.clear());

  it('stores token and checks permissions', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.setSession('token-1', {
        id: 'u1',
        email: 'admin@example.com',
        displayName: 'Admin',
        permissions: ['product:read'],
      });
    });

    expect(result.current.token).toBe('token-1');
    expect(result.current.hasPermission('product:read')).toBe(true);
    expect(result.current.hasPermission('product:write')).toBe(false);
  });

  it('clears session', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.setSession('token-1', {
        id: 'u1',
        email: 'admin@example.com',
        displayName: 'Admin',
        permissions: ['product:read'],
      });
      result.current.clearSession();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
  });
});
```

Run:

```bash
cd commerce-admin
npm run test -- auth.store.test.tsx
```

Expected:

```txt
FAIL because auth.store.tsx does not exist.
```

- [x] **Step 6: Implement auth store**

Create `commerce-admin/src/modules/auth/auth.store.tsx`:

```tsx
import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { setAuthToken } from '../../shared/api/http-client';
import type { CurrentUser, PermissionCode } from './auth.types';

interface AuthState {
  user: CurrentUser | null;
  token: string | null;
  setSession: (token: string, user: CurrentUser) => void;
  clearSession: () => void;
  hasPermission: (permission: PermissionCode) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState<CurrentUser | null>(null);

  const value = useMemo<AuthState>(() => ({
    user,
    token,
    setSession(nextToken, nextUser) {
      localStorage.setItem('accessToken', nextToken);
      setAuthToken(nextToken);
      setToken(nextToken);
      setUser(nextUser);
    },
    clearSession() {
      localStorage.removeItem('accessToken');
      setAuthToken(null);
      setToken(null);
      setUser(null);
    },
    hasPermission(permission) {
      return user?.permissions.includes(permission) ?? false;
    },
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
```

- [x] **Step 7: Register AuthProvider and mock adapter**

Modify `commerce-admin/src/app/AppProviders.tsx`:

```tsx
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
```

- [x] **Step 8: Verify**

Run:

```bash
cd commerce-admin
npm run test -- auth.store.test.tsx
npm run build
```

Expected:

```txt
Auth tests pass and build succeeds.
```

- [x] **Step 9: Commit**

Run:

```bash
git add commerce-admin
 git commit -m "feat(admin): add auth and api foundation"
```

---

### Task 3: Add Routing, Admin Layout And Permission Menu

**Files:**
- Create: `commerce-admin/src/routes/route-permissions.ts`
- Create: `commerce-admin/src/routes/AppRoutes.tsx`
- Create: `commerce-admin/src/layouts/AdminLayout.tsx`
- Create: `commerce-admin/src/shared/auth/PermissionGate.tsx`
- Create: `commerce-admin/src/modules/auth/LoginPage.tsx`
- Create: `commerce-admin/src/modules/dashboard/DashboardPage.tsx`
- Modify: `commerce-admin/src/app/App.tsx`

**Interfaces:**
- Consumes: `useAuth`, `login`, `PermissionCode`.
- Produces: protected routing, login page and permission-based sidebar.

- [x] **Step 1: Create route permission config**

Create `commerce-admin/src/routes/route-permissions.ts`:

```ts
import type { PermissionCode } from '../modules/auth/auth.types';

export interface AdminRouteConfig {
  path: string;
  label: string;
  permission: PermissionCode | null;
}

export const adminRoutes: AdminRouteConfig[] = [
  { path: '/', label: 'Dashboard', permission: null },
  { path: '/categories', label: 'Categories', permission: 'category:read' },
  { path: '/sellers', label: 'Sellers', permission: 'seller:read' },
  { path: '/buyers', label: 'Buyers', permission: 'buyer:read' },
  { path: '/products', label: 'Products', permission: 'product:read' },
  { path: '/reviews', label: 'Reviews', permission: 'review:read' },
  { path: '/ingestion', label: 'Data Sources', permission: 'source:read' },
  { path: '/ai-search', label: 'AI Search', permission: 'ai:search' },
  { path: '/review-intelligence', label: 'Review Intelligence', permission: 'ai:review:analyze' },
  { path: '/analyst-chat', label: 'AI Analyst', permission: 'ai:analyst:chat' },
  { path: '/users-permissions', label: 'Users & Permissions', permission: null },
];
```

- [x] **Step 2: Create PermissionGate**

Create `commerce-admin/src/shared/auth/PermissionGate.tsx`:

```tsx
import type { ReactNode } from 'react';
import { useAuth } from '../../modules/auth/auth.store';
import type { PermissionCode } from '../../modules/auth/auth.types';

export function PermissionGate({ permission, children }: { permission: PermissionCode | null; children: ReactNode }) {
  const auth = useAuth();

  if (!permission || auth.hasPermission(permission)) {
    return <>{children}</>;
  }

  return null;
}
```

- [x] **Step 3: Create login page**

Create `commerce-admin/src/modules/auth/LoginPage.tsx`:

```tsx
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from './auth.api';
import { useAuth } from './auth.store';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  async function handleFinish(values: LoginFormValues) {
    try {
      const result = await login(values.email, values.password);
      auth.setSession(result.accessToken, result.user);
      navigate('/');
    } catch {
      message.error('Không đăng nhập được. Kiểm tra email hoặc mật khẩu.');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f5f5f5' }}>
      <Card style={{ width: 380 }}>
        <Typography.Title level={3}>Commerce Admin</Typography.Title>
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}
```

- [x] **Step 4: Create admin layout**

Create `commerce-admin/src/layouts/AdminLayout.tsx`:

```tsx
import { Layout, Menu, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/auth.store';
import { adminRoutes } from '../routes/route-permissions';

const { Header, Sider, Content } = Layout;

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const visibleItems = adminRoutes
    .filter((item) => !item.permission || auth.hasPermission(item.permission))
    .map((item) => ({ key: item.path, label: item.label }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={248}>
        <div style={{ color: '#fff', padding: 16, fontWeight: 700 }}>Commerce Admin</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={visibleItems}
          onClick={(item) => navigate(item.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography.Text strong>{auth.user?.displayName ?? 'Admin'}</Typography.Text>
          <Typography.Text type="secondary">AI Commerce Marketplace Platform</Typography.Text>
        </Header>
        <Content style={{ padding: 24, background: '#f5f5f5' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
```

- [x] **Step 5: Create dashboard page**

Create `commerce-admin/src/modules/dashboard/DashboardPage.tsx`:

```tsx
import { Card, Col, Row, Statistic, Typography } from 'antd';

export function DashboardPage() {
  return (
    <>
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Products" value={0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Reviews" value={0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Sellers" value={0} /></Card></Col>
        <Col span={6}><Card><Statistic title="AI Jobs" value={0} /></Card></Col>
      </Row>
    </>
  );
}
```

- [x] **Step 6: Create routes**

Create `commerce-admin/src/routes/AppRoutes.tsx`:

```tsx
import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import { Typography } from 'antd';
import { AdminLayout } from '../layouts/AdminLayout';
import { LoginPage } from '../modules/auth/LoginPage';
import { useAuth } from '../modules/auth/auth.store';
import { DashboardPage } from '../modules/dashboard/DashboardPage';

function PlaceholderPage({ title }: { title: string }) {
  return <Typography.Title level={3}>{title}</Typography.Title>;
}

function ProtectedLayout() {
  const auth = useAuth();
  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/categories" element={<PlaceholderPage title="Categories" />} />
          <Route path="/sellers" element={<PlaceholderPage title="Sellers" />} />
          <Route path="/buyers" element={<PlaceholderPage title="Buyers" />} />
          <Route path="/products" element={<PlaceholderPage title="Products" />} />
          <Route path="/reviews" element={<PlaceholderPage title="Reviews" />} />
          <Route path="/ingestion" element={<PlaceholderPage title="Data Sources" />} />
          <Route path="/ai-search" element={<PlaceholderPage title="AI Search" />} />
          <Route path="/review-intelligence" element={<PlaceholderPage title="Review Intelligence" />} />
          <Route path="/analyst-chat" element={<PlaceholderPage title="AI Analyst" />} />
          <Route path="/users-permissions" element={<PlaceholderPage title="Users & Permissions" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

- [x] **Step 7: Wire AppRoutes**

Modify `commerce-admin/src/app/App.tsx`:

```tsx
import { AppRoutes } from '../routes/AppRoutes';

export function App() {
  return <AppRoutes />;
}
```

- [x] **Step 8: Verify**

Run:

```bash
cd commerce-admin
npm run build
npm run test
```

Expected:

```txt
Build and tests pass.
```

- [x] **Step 9: Commit**

Run:

```bash
git add commerce-admin
 git commit -m "feat(admin): add layout and routing"
```

---

### Task 4: Add Shared Data Components And CMS Page Placeholders

**Files:**
- Create: `commerce-admin/src/shared/components/DataPageHeader.tsx`
- Create: `commerce-admin/src/shared/components/StatusTag.tsx`
- Create: `commerce-admin/src/shared/types/pagination.ts`
- Create: `commerce-admin/src/modules/categories/category.types.ts`
- Create: `commerce-admin/src/modules/categories/category.api.ts`
- Create: `commerce-admin/src/modules/categories/CategoriesPage.tsx`
- Create: `commerce-admin/src/modules/sellers/SellersPage.tsx`
- Create: `commerce-admin/src/modules/buyers/BuyersPage.tsx`
- Create: `commerce-admin/src/modules/products/ProductsPage.tsx`
- Create: `commerce-admin/src/modules/products/ProductDetailPage.tsx`
- Create: `commerce-admin/src/modules/reviews/ReviewsPage.tsx`
- Create: `commerce-admin/src/modules/ingestion/IngestionPage.tsx`
- Create: `commerce-admin/src/modules/ai-search/AiSearchPage.tsx`
- Create: `commerce-admin/src/modules/review-intelligence/ReviewIntelligencePage.tsx`
- Create: `commerce-admin/src/modules/analyst-chat/AnalystChatPage.tsx`
- Create: `commerce-admin/src/modules/users-permissions/UsersPermissionsPage.tsx`
- Modify: `commerce-admin/src/routes/AppRoutes.tsx`

**Interfaces:**
- Consumes: `coreApi`, `DataPageHeader`, route setup.
- Produces: visible CMS page skeletons and one real category API contract sample.

- [x] **Step 1: Create shared data components**

Create `commerce-admin/src/shared/components/DataPageHeader.tsx`:

```tsx
import { Button, Space, Typography } from 'antd';
import type { ReactNode } from 'react';

interface DataPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function DataPageHeader({ title, description, actions }: DataPageHeaderProps) {
  return (
    <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 16 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>{title}</Typography.Title>
          {description ? <Typography.Text type="secondary">{description}</Typography.Text> : null}
        </div>
        {actions ?? <Button type="primary">Tạo mới</Button>}
      </Space>
    </Space>
  );
}
```

Create `commerce-admin/src/shared/components/StatusTag.tsx`:

```tsx
import { Tag } from 'antd';

const colorByStatus: Record<string, string> = {
  ACTIVE: 'green',
  INACTIVE: 'default',
  DRAFT: 'blue',
  PENDING: 'gold',
  FAILED: 'red',
  COMPLETED: 'green',
};

export function StatusTag({ status }: { status: string }) {
  return <Tag color={colorByStatus[status] ?? 'default'}>{status}</Tag>;
}
```

Create `commerce-admin/src/shared/types/pagination.ts`:

```ts
export interface PageRequest {
  page: number;
  pageSize: number;
}

export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

- [x] **Step 2: Create category types and API**

Create `commerce-admin/src/modules/categories/category.types.ts`:

```ts
export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  path: string;
  level: number;
  status: string;
}

export interface CategoryAttribute {
  id: string;
  categoryId: string;
  code: string;
  label: string;
  dataType: 'text' | 'number' | 'boolean' | 'select' | 'multi_select';
  isFilterable: boolean;
  isSearchable: boolean;
  isRequired: boolean;
  unit?: string | null;
}
```

Create `commerce-admin/src/modules/categories/category.api.ts`:

```ts
import { coreApi } from '../../shared/api/http-client';
import type { Category, CategoryAttribute } from './category.types';

export async function fetchCategories(): Promise<Category[]> {
  const response = await coreApi.get<Category[]>('/categories');
  return response.data;
}

export async function fetchCategoryAttributes(categoryId: string): Promise<CategoryAttribute[]> {
  const response = await coreApi.get<CategoryAttribute[]>(`/categories/${categoryId}/attributes`);
  return response.data;
}
```

- [x] **Step 3: Create categories page**

Create `commerce-admin/src/modules/categories/CategoriesPage.tsx`:

```tsx
import { Table } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { DataPageHeader } from '../../shared/components/DataPageHeader';
import { StatusTag } from '../../shared/components/StatusTag';
import { fetchCategories } from './category.api';

export function CategoriesPage() {
  const query = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  return (
    <>
      <DataPageHeader title="Categories" description="Quản lý category tree và dynamic attributes." />
      <Table
        rowKey="id"
        loading={query.isLoading}
        dataSource={query.data ?? []}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Path', dataIndex: 'path' },
          { title: 'Level', dataIndex: 'level' },
          { title: 'Status', dataIndex: 'status', render: (status) => <StatusTag status={status} /> },
        ]}
      />
    </>
  );
}
```

- [x] **Step 4: Create placeholder pages**

Create each file with the matching component and text:

`commerce-admin/src/modules/sellers/SellersPage.tsx`:

```tsx
import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function SellersPage() {
  return (
    <>
      <DataPageHeader title="Sellers" description="Quản lý seller trong marketplace." />
      <Empty description="Sellers API chưa được kết nối." />
    </>
  );
}
```

`commerce-admin/src/modules/buyers/BuyersPage.tsx`:

```tsx
import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function BuyersPage() {
  return (
    <>
      <DataPageHeader title="Buyers" description="Quản lý buyer/customer." />
      <Empty description="Buyers API chưa được kết nối." />
    </>
  );
}
```

`commerce-admin/src/modules/products/ProductsPage.tsx`:

```tsx
import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function ProductsPage() {
  return (
    <>
      <DataPageHeader title="Products" description="Quản lý product catalog, variants, images và specs." />
      <Empty description="Products API chưa được kết nối." />
    </>
  );
}
```

`commerce-admin/src/modules/products/ProductDetailPage.tsx`:

```tsx
import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function ProductDetailPage() {
  return (
    <>
      <DataPageHeader title="Product Detail" description="Chi tiết product, variants, images, specs và reviews." />
      <Empty description="Product detail API chưa được kết nối." />
    </>
  );
}
```

`commerce-admin/src/modules/reviews/ReviewsPage.tsx`:

```tsx
import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function ReviewsPage() {
  return (
    <>
      <DataPageHeader title="Reviews" description="Quản lý review gốc và moderation status." />
      <Empty description="Reviews API chưa được kết nối." />
    </>
  );
}
```

`commerce-admin/src/modules/ingestion/IngestionPage.tsx`:

```tsx
import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function IngestionPage() {
  return (
    <>
      <DataPageHeader title="Data Sources" description="Quản lý source registry, imports, sync runs và raw snapshots." />
      <Empty description="Ingestion APIs chưa được kết nối." />
    </>
  );
}
```

`commerce-admin/src/modules/ai-search/AiSearchPage.tsx`:

```tsx
import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function AiSearchPage() {
  return (
    <>
      <DataPageHeader title="AI Search" description="Semantic product search với filters, score và explanation." actions={null} />
      <Empty description="AI Search API sẽ được nối sau khi AI Platform có skeleton." />
    </>
  );
}
```

`commerce-admin/src/modules/review-intelligence/ReviewIntelligencePage.tsx`:

```tsx
import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function ReviewIntelligencePage() {
  return (
    <>
      <DataPageHeader title="Review Intelligence" description="Sentiment, topics và product review summary." actions={null} />
      <Empty description="Review Intelligence API sẽ được nối sau khi AI Platform có skeleton." />
    </>
  );
}
```

`commerce-admin/src/modules/analyst-chat/AnalystChatPage.tsx`:

```tsx
import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function AnalystChatPage() {
  return (
    <>
      <DataPageHeader title="AI Analyst" description="Text-to-SQL analyst cho admin." actions={null} />
      <Empty description="AI Analyst API sẽ được nối sau khi AI Platform có skeleton." />
    </>
  );
}
```

`commerce-admin/src/modules/users-permissions/UsersPermissionsPage.tsx`:

```tsx
import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function UsersPermissionsPage() {
  return (
    <>
      <DataPageHeader title="Users & Permissions" description="Quản lý admin users và permission-based access." />
      <Empty description="Users and permissions API chưa được kết nối." />
    </>
  );
}
```

- [x] **Step 5: Wire pages into routes**

Modify `commerce-admin/src/routes/AppRoutes.tsx` to import pages and replace placeholders:

```tsx
import { CategoriesPage } from '../modules/categories/CategoriesPage';
import { SellersPage } from '../modules/sellers/SellersPage';
import { BuyersPage } from '../modules/buyers/BuyersPage';
import { ProductsPage } from '../modules/products/ProductsPage';
import { ProductDetailPage } from '../modules/products/ProductDetailPage';
import { ReviewsPage } from '../modules/reviews/ReviewsPage';
import { IngestionPage } from '../modules/ingestion/IngestionPage';
import { AiSearchPage } from '../modules/ai-search/AiSearchPage';
import { ReviewIntelligencePage } from '../modules/review-intelligence/ReviewIntelligencePage';
import { AnalystChatPage } from '../modules/analyst-chat/AnalystChatPage';
import { UsersPermissionsPage } from '../modules/users-permissions/UsersPermissionsPage';
```

Routes:

```tsx
<Route path="/categories" element={<CategoriesPage />} />
<Route path="/sellers" element={<SellersPage />} />
<Route path="/buyers" element={<BuyersPage />} />
<Route path="/products" element={<ProductsPage />} />
<Route path="/products/:productId" element={<ProductDetailPage />} />
<Route path="/reviews" element={<ReviewsPage />} />
<Route path="/ingestion" element={<IngestionPage />} />
<Route path="/ai-search" element={<AiSearchPage />} />
<Route path="/review-intelligence" element={<ReviewIntelligencePage />} />
<Route path="/analyst-chat" element={<AnalystChatPage />} />
<Route path="/users-permissions" element={<UsersPermissionsPage />} />
```

- [x] **Step 6: Verify**

Run:

```bash
cd commerce-admin
npm run build
npm run test
```

Expected:

```txt
Build and tests pass.
```

- [x] **Step 7: Commit**

Run:

```bash
git add commerce-admin
 git commit -m "feat(admin): add cms page skeletons"
```

---

### Task 5: Add Verification Checklist And Push

**Files:**
- Create: `docs/verification/cms-base-checklist.md`
- Modify: `docs/superpowers/plans/2026-07-29-cms-base-implementation-plan.md`

**Interfaces:**
- Consumes: Tasks 1-4.
- Produces: final manual verification checklist for CMS base.

- [x] **Step 1: Create verification checklist**

Create `docs/verification/cms-base-checklist.md`:

````markdown
# CMS Base Verification Checklist

## Build And Tests

- [x] `cd commerce-admin && npm install` completes.
- [x] `cd commerce-admin && npm run build` passes.
- [x] `cd commerce-admin && npm run test` passes.

## App Shell

- [x] Login page renders at `/login`.
- [x] Mock login works when `VITE_USE_MOCK_API=true`.
- [x] Protected routes redirect to `/login` when no token exists.
- [x] Admin layout renders sidebar, header and content area after login.
- [x] Permission-based menu hides routes without permissions.

## Pages

- [x] Dashboard page renders.
- [x] Categories page renders and calls `/categories`.
- [x] Sellers page renders.
- [x] Buyers page renders.
- [x] Products page renders.
- [x] Product detail route exists.
- [x] Reviews page renders.
- [x] Data Sources page renders.
- [x] AI Search page renders.
- [x] Review Intelligence page renders.
- [x] AI Analyst page renders.
- [x] Users & Permissions page renders.

## Boundaries

- [x] Admin does not query database directly.
- [x] Admin does not implement marketplace business rules.
- [x] Core Java code is not scaffolded or modified by this CMS base work.
- [x] AI Platform code is not scaffolded or modified by this CMS base work.
````

- [x] **Step 2: Run final verification commands**

Run:

```bash
cd commerce-admin
npm run build
npm run test
```

Expected:

```txt
Build and tests pass.
```

- [x] **Step 3: Commit verification docs**

Run:

```bash
git add docs/verification/cms-base-checklist.md
 git commit -m "docs(admin): add cms base verification checklist"
```

- [x] **Step 4: Push branch**

Run:

```bash
git push
```

Expected:

```txt
Local commits are pushed to origin.
```

---

## Self-Review

Spec coverage:

- Scaffold CMS app: Task 1.
- Auth/session/API foundation: Task 2.
- Permission menu and layout: Task 3.
- Data-operation page skeletons: Task 4.
- Verification checklist: Task 5.
- Core Java and AI Platform are intentionally not implemented in this CMS base plan.

Placeholder scan:

- No placeholder tokens or vague catch-all steps are intentionally left.
- Page placeholders are deliberate user-facing skeleton pages for APIs not available yet, not unfinished plan content.

Type consistency:

- `PermissionCode` is defined in Task 2 and consumed by route config and permission gate in Task 3.
- `coreApi`, `aiApi`, and `setAuthToken` are defined in Task 2 and used by auth/API modules.
- `Category` and `CategoryAttribute` are defined before `category.api.ts` and `CategoriesPage.tsx` consume them.
