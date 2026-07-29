# Phase 1 Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây phase 1 cho AI Commerce Marketplace Platform theo hướng admin-first: có Core Admin, realistic dataset foundation, AI semantic search, review intelligence và text-to-SQL analyst.

**Architecture:** Hệ thống tách 4 repo ngang hàng: `commerce-admin`, `commerce-core-service`, `commerce-ai-platform`, `commerce-platform-infra`. Admin gọi Core API và AI API; AI đọc core data qua Core API hoặc PostgreSQL read-only, chỉ ghi vào schema `ai`. Core Java sở hữu auth/permission, marketplace data và ingestion foundation, nhưng plan này chỉ mô tả nhiệm vụ của Core, không hướng dẫn code Java chi tiết.

**Tech Stack:** React + Vite + Ant Design cho admin; Spring Boot Java cho core-service; NestJS cho AI Platform; PostgreSQL + pgvector, Redis, MinIO và Docker Compose cho infra.

## Global Constraints

- Phase 1 dùng 4 repo ngang hàng: `commerce-admin`, `commerce-core-service`, `commerce-ai-platform`, `commerce-platform-infra`.
- Phase 1 ưu tiên Admin + AI song song theo milestone M1 đến M5.
- `commerce-admin` không sở hữu business logic và không query database trực tiếp.
- `commerce-core-service` sở hữu identity, marketplace, ingestion và analytics data.
- `commerce-ai-platform` sở hữu schema AI và không update trực tiếp bảng core.
- AI Platform dùng NestJS, provider abstraction cho embedding/chat và PostgreSQL + pgvector làm vector store.
- Text-to-SQL chỉ được chạy `SELECT`, ưu tiên analytics views, whitelist bảng/cột core, dùng read-only DB user và audit log.
- Core-service Java trong plan này chỉ mô tả trách nhiệm/module/API/schema cần cung cấp, không viết hướng dẫn implementation Java chi tiết.
- Dữ liệu phase đầu là synthetic realistic dataset, không phải dữ liệu random sơ sài.
- Docker full system phải chạy được từ `commerce-platform-infra`.

---

## File Structure

Các repo nằm ngang hàng trong folder tổng:

```txt
Ecommerc/
  commerce-admin/
  commerce-core-service/
  commerce-ai-platform/
  commerce-platform-infra/
  docs/
```

Tài liệu hiện tại nằm ở repo/folder planning:

```txt
docs/
  superpowers/specs/2026-07-29-ai-commerce-marketplace-platform-design.md
  architecture/
  modules/
  api-contracts/
  infra/
  superpowers/plans/2026-07-29-phase-1-master-implementation-plan.md
```

Repo dự kiến sau khi scaffold:

```txt
commerce-admin/
  src/
    app/
    pages/
    routes/
    layouts/
    modules/
      auth/
      categories/
      sellers/
      products/
      reviews/
      ingestion/
      ai-search/
      review-intelligence/
      analyst-chat/
      users-permissions/
    shared/
      api/
      auth/
      components/
      config/
      types/
  package.json
  vite.config.ts
  Dockerfile
```

```txt
commerce-ai-platform/
  src/
    modules/
      providers/
      vector-store/
      indexing/
      semantic-search/
      review-intelligence/
      analyst-chat/
      sql-safety/
      ai-logs/
    shared/
      config/
      database/
      auth/
  package.json
  Dockerfile
```

```txt
commerce-core-service/
  Core Java source tree do bạn BE Java quyết định.
  Bắt buộc expose các module/API/schema được mô tả trong plan này.
```

```txt
commerce-platform-infra/
  docker-compose.yml
  .env.example
  postgres/
    init/
  minio/
  README.md
```

---

### Task 1: Create Repo Skeletons And Shared Documentation Links

**Files:**
- Create: `commerce-admin/README.md`
- Create: `commerce-core-service/README.md`
- Create: `commerce-ai-platform/README.md`
- Create: `commerce-platform-infra/README.md`
- Modify: `docs/README.md`

**Interfaces:**
- Consumes: Design docs under `docs/`.
- Produces: Repo boundary documentation that all later tasks rely on.

- [ ] **Step 1: Create four repo folders**

Run:

```bash
mkdir -p commerce-admin commerce-core-service commerce-ai-platform commerce-platform-infra
```

Expected:

```txt
commerce-admin/
commerce-core-service/
commerce-ai-platform/
commerce-platform-infra/
```

- [ ] **Step 2: Add README for commerce-admin**

Create `commerce-admin/README.md`:

```markdown
# commerce-admin

React + Vite + Ant Design admin CMS for AI Commerce Marketplace Platform.

Responsibilities:

- Admin login/session UI.
- Permission-based menu and route guards.
- Marketplace data operation screens.
- Data source/import screens.
- AI Search, Review Intelligence and AI Analyst screens.

Non-responsibilities:

- No business data ownership.
- No direct database access.
- No marketplace business rules beyond UI validation.

Upstream APIs:

- commerce-core-service
- commerce-ai-platform
```

- [ ] **Step 3: Add README for commerce-core-service**

Create `commerce-core-service/README.md`:

```markdown
# commerce-core-service

Spring Boot Java core backend for marketplace data, auth, permissions and ingestion foundation.

This repo is owned by the Java backend engineer. This planning workspace documents what the service must provide, but does not prescribe Java implementation details.

Required responsibilities:

- Auth and permission-based authorization.
- Sellers and buyers.
- Categories and category attributes.
- Products, variants and images.
- Reviews.
- Basic orders for analytics.
- Data sources, sync runs, raw snapshots, source products and source reviews.
- Analytics views/API for AI analyst.

Required consumers:

- commerce-admin
- commerce-ai-platform
```

- [ ] **Step 4: Add README for commerce-ai-platform**

Create `commerce-ai-platform/README.md`:

```markdown
# commerce-ai-platform

NestJS AI service for semantic search, review intelligence and text-to-SQL analyst.

Responsibilities:

- Provider abstraction for embedding and chat models.
- Product/review indexing.
- PostgreSQL + pgvector vector search.
- Review sentiment/topic/summary generation.
- Text-to-SQL analyst with strict read-only safety guardrails.
- AI query logs and job status APIs.

Data boundary:

- Read core data through Core API or PostgreSQL read-only user.
- Write only to AI schema/tables.
```

- [ ] **Step 5: Add README for commerce-platform-infra**

Create `commerce-platform-infra/README.md`:

```markdown
# commerce-platform-infra

Docker Compose and local infrastructure for the AI Commerce Marketplace Platform.

Services:

- PostgreSQL + pgvector
- Redis
- MinIO
- commerce-core-service
- commerce-ai-platform
- commerce-admin

This repo is the local entrypoint for running the full system.
```

- [ ] **Step 6: Update docs index**

Modify `docs/README.md` to add:

```markdown
## Repo folders

- `commerce-admin`: React/Vite admin CMS.
- `commerce-core-service`: Spring Boot Java core backend.
- `commerce-ai-platform`: NestJS AI backend.
- `commerce-platform-infra`: Docker Compose local infrastructure.
```

- [ ] **Step 7: Verify**

Run:

```bash
find commerce-admin commerce-core-service commerce-ai-platform commerce-platform-infra -maxdepth 1 -name README.md -print
```

Expected output contains:

```txt
commerce-admin/README.md
commerce-core-service/README.md
commerce-ai-platform/README.md
commerce-platform-infra/README.md
```

---

### Task 2: Define Core-Service Responsibilities For Java Engineer

**Files:**
- Create: `docs/core-service/implementation-brief.md`
- Modify: `docs/modules/core-service.md`
- Modify: `docs/api-contracts/core-api.md`

**Interfaces:**
- Consumes: Database model and API draft from `docs/modules/database-model.md` and `docs/api-contracts/core-api.md`.
- Produces: Clear backend contract for `commerce-admin` and `commerce-ai-platform`.

- [ ] **Step 1: Create implementation brief folder**

Run:

```bash
mkdir -p docs/core-service
```

Expected:

```txt
docs/core-service/
```

- [ ] **Step 2: Create core-service implementation brief**

Create `docs/core-service/implementation-brief.md`:

```markdown
# Core-Service Implementation Brief

Mục tiêu của core-service là cung cấp backend marketplace core cho Admin CMS và AI Platform.

Plan này không hướng dẫn code Java chi tiết. Bạn BE Java tự chọn cấu trúc source, migration và test theo chuẩn team.

## Required Modules

### 1. Auth And Permissions

Core-service phải cung cấp:

- Login/logout.
- Current user endpoint.
- Permission list của current user.
- Permission-based authorization theo resource/action.

Required permission codes:

- `product:read`
- `product:write`
- `review:read`
- `review:moderate`
- `seller:read`
- `seller:write`
- `buyer:read`
- `buyer:write`
- `category:read`
- `category:write`
- `source:read`
- `source:write`
- `source:sync`
- `ai:search`
- `ai:review:analyze`
- `ai:analyst:chat`

### 2. Seller Management

Core-service phải quản lý sellers:

- list/search/filter sellers;
- create seller;
- update seller;
- get seller detail;
- seller status.

### 3. Buyer Management

Core-service phải quản lý buyers/customers:

- list/search/filter buyers;
- create buyer;
- update buyer;
- get buyer detail;
- buyer status.

### 4. Category And Attribute Management

Core-service phải quản lý:

- category tree;
- category create/update/delete mềm nếu cần;
- category attributes;
- attribute metadata: code, label, data type, filterable, searchable, required, unit, options.

### 5. Product Catalog

Core-service phải quản lý canonical products:

- list/search/filter products;
- create/update product;
- product detail;
- product variants;
- product images;
- `specs_json`;
- status.

Product phải liên kết seller và category.

### 6. Reviews

Core-service phải quản lý review gốc:

- list/search/filter reviews;
- create/import review;
- review detail;
- moderation status;
- relation với product, seller và buyer.

AI analysis không lưu trực tiếp trong bảng review gốc.

### 7. Basic Orders

Core-service phải có order cơ bản cho analytics:

- orders;
- order items;
- buyer relation;
- seller relation;
- product/variant relation;
- status;
- payment_status giả lập.

Không cần payment/shipping integration thật trong phase 1.

### 8. Data Source And Import

Core-service phải hỗ trợ:

- data source registry;
- import CSV/JSON;
- sync run history;
- raw snapshot metadata;
- source products;
- source reviews;
- mapping từ source records sang canonical records.

### 9. Analytics

Core-service phải cung cấp analytics views hoặc read models cho AI analyst:

- product performance;
- review sentiment aggregate;
- seller performance;
- category summary.

AI Platform sẽ ưu tiên query analytics views trước khi query bảng core whitelist.

## Required API Groups

Core-service cần expose các nhóm API đã draft trong:

`docs/api-contracts/core-api.md`

## Required Database Ownership

Core-service sở hữu schema logic:

- `identity`
- `marketplace`
- `ingestion`
- `analytics`

AI Platform chỉ được read-only trên phần whitelist của các schema này.

## Done Criteria

Core-service được xem là đủ cho phase 1 khi:

1. Admin login được và lấy được permissions.
2. Admin có thể CRUD category, category attributes, sellers, buyers, products và reviews.
3. Admin có thể import product/review dataset qua source/import flow.
4. Database có realistic dataset để AI index.
5. Analytics views/API đủ cho text-to-SQL analyst.
6. AI Platform có read-only access an toàn vào data cần thiết.
```

- [ ] **Step 3: Verify no Java implementation instructions leaked in brief**

Run:

```bash
rg -n "Spring Data|Maven|Gradle|Repository pattern|Controller layer|Service layer" docs/core-service/implementation-brief.md
```

Expected:

```txt
No matches for implementation-specific Java instructions.
```

If `rg` returns matches only because of prose like `core-service`, keep them only when not prescribing Java code organization.

- [ ] **Step 4: Cross-check required API groups**

Run:

```bash
rg -n "^## |^```txt|^GET |^POST |^PATCH |^DELETE " docs/api-contracts/core-api.md
```

Expected:

```txt
Auth, Users And Permissions, Sellers, Buyers, Categories, Category Attributes, Products, Reviews, Data Sources And Imports, Analytics sections are present.
```

---

### Task 3: Scaffold Admin React App

**Files:**
- Create: `commerce-admin/package.json`
- Create: `commerce-admin/vite.config.ts`
- Create: `commerce-admin/tsconfig.json`
- Create: `commerce-admin/index.html`
- Create: `commerce-admin/src/main.tsx`
- Create: `commerce-admin/src/app/App.tsx`
- Create: `commerce-admin/src/shared/config/env.ts`
- Create: `commerce-admin/src/shared/api/http-client.ts`
- Create: `commerce-admin/Dockerfile`

**Interfaces:**
- Consumes: Core API base URL and AI API base URL from env.
- Produces: Running React/Vite admin shell for later screens.

- [ ] **Step 1: Initialize Vite React TypeScript**

Run:

```bash
cd commerce-admin
npm create vite@latest . -- --template react-ts
```

Expected:

```txt
package.json
src/main.tsx
vite.config.ts
```

- [ ] **Step 2: Install admin dependencies**

Run:

```bash
cd commerce-admin
npm install antd @ant-design/icons @tanstack/react-query axios react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected:

```txt
Dependencies installed without errors.
```

- [ ] **Step 3: Define env contract**

Create `commerce-admin/src/shared/config/env.ts`:

```ts
export const env = {
  coreApiBaseUrl: import.meta.env.VITE_CORE_API_BASE_URL ?? 'http://localhost:8080',
  aiApiBaseUrl: import.meta.env.VITE_AI_API_BASE_URL ?? 'http://localhost:3001',
};
```

- [ ] **Step 4: Define HTTP client interface**

Create `commerce-admin/src/shared/api/http-client.ts`:

```ts
import axios from 'axios';
import { env } from '../config/env';

export const coreApi = axios.create({
  baseURL: env.coreApiBaseUrl,
});

export const aiApi = axios.create({
  baseURL: env.aiApiBaseUrl,
});

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

- [ ] **Step 5: Create minimal app shell**

Create `commerce-admin/src/app/App.tsx`:

```tsx
import { ConfigProvider, Layout, Typography } from 'antd';

const { Header, Content } = Layout;

export function App() {
  return (
    <ConfigProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ color: '#fff', fontWeight: 600 }}>Commerce Admin</Header>
        <Content style={{ padding: 24 }}>
          <Typography.Title level={3}>AI Commerce Marketplace Platform</Typography.Title>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
```

- [ ] **Step 6: Wire app entry**

Modify `commerce-admin/src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 7: Add Dockerfile**

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

- [ ] **Step 8: Verify admin app**

Run:

```bash
cd commerce-admin
npm run build
```

Expected:

```txt
Build completes successfully.
```

---

### Task 4: Build Admin Auth, Layout And Permission Menu

**Files:**
- Create: `commerce-admin/src/modules/auth/auth.types.ts`
- Create: `commerce-admin/src/modules/auth/auth.api.ts`
- Create: `commerce-admin/src/modules/auth/auth.store.tsx`
- Create: `commerce-admin/src/modules/auth/LoginPage.tsx`
- Create: `commerce-admin/src/layouts/AdminLayout.tsx`
- Create: `commerce-admin/src/routes/AppRoutes.tsx`
- Modify: `commerce-admin/src/app/App.tsx`

**Interfaces:**
- Consumes: Core endpoints `POST /auth/login`, `GET /auth/me`, `GET /auth/me/permissions`.
- Produces: Authenticated admin shell and permission-based menu.

- [ ] **Step 1: Define auth types**

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

- [ ] **Step 2: Define auth API client**

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

- [ ] **Step 3: Implement auth store**

Create `commerce-admin/src/modules/auth/auth.store.tsx`:

```tsx
import { createContext, useContext, useMemo, useState } from 'react';
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

- [ ] **Step 4: Create login page**

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

- [ ] **Step 5: Create admin layout with permission menu**

Create `commerce-admin/src/layouts/AdminLayout.tsx`:

```tsx
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/auth.store';
import type { PermissionCode } from '../modules/auth/auth.types';

const { Header, Sider, Content } = Layout;

const menuItems: Array<{ key: string; label: string; permission: PermissionCode }> = [
  { key: '/categories', label: 'Categories', permission: 'category:read' },
  { key: '/sellers', label: 'Sellers', permission: 'seller:read' },
  { key: '/products', label: 'Products', permission: 'product:read' },
  { key: '/reviews', label: 'Reviews', permission: 'review:read' },
  { key: '/ingestion', label: 'Data Sources', permission: 'source:read' },
  { key: '/ai-search', label: 'AI Search', permission: 'ai:search' },
  { key: '/review-intelligence', label: 'Review Intelligence', permission: 'ai:review:analyze' },
  { key: '/analyst-chat', label: 'AI Analyst', permission: 'ai:analyst:chat' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const auth = useAuth();
  const visibleItems = menuItems
    .filter((item) => auth.hasPermission(item.permission))
    .map(({ key, label }) => ({ key, label }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ color: '#fff', padding: 16, fontWeight: 600 }}>Commerce Admin</div>
        <Menu theme="dark" mode="inline" items={visibleItems} onClick={(item) => navigate(item.key)} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff' }}>{auth.user?.displayName ?? 'Admin'}</Header>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
```

- [ ] **Step 6: Wire routes**

Create `commerce-admin/src/routes/AppRoutes.tsx`:

```tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Typography } from 'antd';
import { AdminLayout } from '../layouts/AdminLayout';
import { LoginPage } from '../modules/auth/LoginPage';
import { useAuth } from '../modules/auth/auth.store';

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
          <Route path="/" element={<PlaceholderPage title="Dashboard" />} />
          <Route path="/categories" element={<PlaceholderPage title="Categories" />} />
          <Route path="/sellers" element={<PlaceholderPage title="Sellers" />} />
          <Route path="/products" element={<PlaceholderPage title="Products" />} />
          <Route path="/reviews" element={<PlaceholderPage title="Reviews" />} />
          <Route path="/ingestion" element={<PlaceholderPage title="Data Sources" />} />
          <Route path="/ai-search" element={<PlaceholderPage title="AI Search" />} />
          <Route path="/review-intelligence" element={<PlaceholderPage title="Review Intelligence" />} />
          <Route path="/analyst-chat" element={<PlaceholderPage title="AI Analyst" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 7: Update app root**

Modify `commerce-admin/src/app/App.tsx`:

```tsx
import { ConfigProvider } from 'antd';
import { AuthProvider } from '../modules/auth/auth.store';
import { AppRoutes } from '../routes/AppRoutes';

export function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ConfigProvider>
  );
}
```

- [ ] **Step 8: Verify**

Run:

```bash
cd commerce-admin
npm run build
```

Expected:

```txt
Build completes successfully.
```

---

### Task 5: Build Admin Data Operation Screens

**Files:**
- Create: `commerce-admin/src/shared/components/DataPageHeader.tsx`
- Create: `commerce-admin/src/shared/components/StatusTag.tsx`
- Create: `commerce-admin/src/modules/categories/CategoriesPage.tsx`
- Create: `commerce-admin/src/modules/categories/category.types.ts`
- Create: `commerce-admin/src/modules/categories/category.api.ts`
- Create: `commerce-admin/src/modules/sellers/SellersPage.tsx`
- Create: `commerce-admin/src/modules/products/ProductsPage.tsx`
- Create: `commerce-admin/src/modules/products/ProductDetailPage.tsx`
- Create: `commerce-admin/src/modules/reviews/ReviewsPage.tsx`
- Create: `commerce-admin/src/modules/ingestion/IngestionPage.tsx`
- Modify: `commerce-admin/src/routes/AppRoutes.tsx`

**Interfaces:**
- Consumes: Core API groups for categories, sellers, products, reviews and ingestion.
- Produces: Data-operation CMS screens for milestone M1 and M2.

- [ ] **Step 1: Create shared page header**

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

- [ ] **Step 2: Create status tag**

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

- [ ] **Step 3: Define category API contract types**

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

- [ ] **Step 4: Define category API client**

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

- [ ] **Step 5: Create category page**

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

- [ ] **Step 6: Create placeholder pages for other data modules**

Create files:

```txt
commerce-admin/src/modules/sellers/SellersPage.tsx
commerce-admin/src/modules/products/ProductsPage.tsx
commerce-admin/src/modules/products/ProductDetailPage.tsx
commerce-admin/src/modules/reviews/ReviewsPage.tsx
commerce-admin/src/modules/ingestion/IngestionPage.tsx
```

Each file uses this pattern with its own title:

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

Use matching component names:

```txt
SellersPage
ProductsPage
ProductDetailPage
ReviewsPage
IngestionPage
```

- [ ] **Step 7: Wire data pages into routes**

Modify `commerce-admin/src/routes/AppRoutes.tsx` to import and use these pages:

```tsx
import { CategoriesPage } from '../modules/categories/CategoriesPage';
import { SellersPage } from '../modules/sellers/SellersPage';
import { ProductsPage } from '../modules/products/ProductsPage';
import { ProductDetailPage } from '../modules/products/ProductDetailPage';
import { ReviewsPage } from '../modules/reviews/ReviewsPage';
import { IngestionPage } from '../modules/ingestion/IngestionPage';
```

Route mapping:

```tsx
<Route path="/categories" element={<CategoriesPage />} />
<Route path="/sellers" element={<SellersPage />} />
<Route path="/products" element={<ProductsPage />} />
<Route path="/products/:productId" element={<ProductDetailPage />} />
<Route path="/reviews" element={<ReviewsPage />} />
<Route path="/ingestion" element={<IngestionPage />} />
```

- [ ] **Step 8: Verify**

Run:

```bash
cd commerce-admin
npm run build
```

Expected:

```txt
Build completes successfully.
```

---

### Task 6: Scaffold AI Platform NestJS App

**Files:**
- Create: `commerce-ai-platform/package.json`
- Create: `commerce-ai-platform/src/main.ts`
- Create: `commerce-ai-platform/src/app.module.ts`
- Create: `commerce-ai-platform/src/shared/config/env.ts`
- Create: `commerce-ai-platform/src/shared/database/database.module.ts`
- Create: `commerce-ai-platform/Dockerfile`

**Interfaces:**
- Consumes: PostgreSQL connection, Redis connection, Core API base URL and model provider env.
- Produces: Running NestJS AI service shell.

- [ ] **Step 1: Create NestJS app**

Run:

```bash
cd commerce-ai-platform
npx @nestjs/cli new . --package-manager npm
```

Expected:

```txt
src/main.ts
src/app.module.ts
package.json
```

- [ ] **Step 2: Install AI service dependencies**

Run:

```bash
cd commerce-ai-platform
npm install @nestjs/config @nestjs/axios @nestjs/bullmq bullmq ioredis pg zod
npm install openai
```

Expected:

```txt
Dependencies installed without errors.
```

- [ ] **Step 3: Define env helper**

Create `commerce-ai-platform/src/shared/config/env.ts`:

```ts
export interface AiPlatformEnv {
  port: number;
  coreApiBaseUrl: string;
  databaseUrl: string;
  redisUrl: string;
  openAiApiKey?: string;
  embeddingProvider: 'openai' | 'ollama';
  chatProvider: 'openai' | 'ollama';
}

export function loadEnv(): AiPlatformEnv {
  return {
    port: Number(process.env.PORT ?? 3001),
    coreApiBaseUrl: process.env.CORE_API_BASE_URL ?? 'http://localhost:8080',
    databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/commerce',
    redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
    openAiApiKey: process.env.OPENAI_API_KEY,
    embeddingProvider: (process.env.EMBEDDING_PROVIDER ?? 'openai') as 'openai' | 'ollama',
    chatProvider: (process.env.CHAT_PROVIDER ?? 'openai') as 'openai' | 'ollama',
  };
}
```

- [ ] **Step 4: Add health endpoint**

Create `commerce-ai-platform/src/app.controller.ts`:

```ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  health() {
    return { status: 'ok', service: 'commerce-ai-platform' };
  }
}
```

Modify `commerce-ai-platform/src/app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
})
export class AppModule {}
```

- [ ] **Step 5: Add Dockerfile**

Create `commerce-ai-platform/Dockerfile`:

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

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

- [ ] **Step 6: Verify AI service**

Run:

```bash
cd commerce-ai-platform
npm run build
npm test
```

Expected:

```txt
Build and tests complete successfully.
```

---

### Task 7: Implement AI Provider And Vector Store Interfaces

**Files:**
- Create: `commerce-ai-platform/src/modules/providers/embedding-provider.interface.ts`
- Create: `commerce-ai-platform/src/modules/providers/chat-provider.interface.ts`
- Create: `commerce-ai-platform/src/modules/providers/openai-embedding.provider.ts`
- Create: `commerce-ai-platform/src/modules/providers/openai-chat.provider.ts`
- Create: `commerce-ai-platform/src/modules/providers/providers.module.ts`
- Create: `commerce-ai-platform/src/modules/vector-store/vector-store.interface.ts`
- Create: `commerce-ai-platform/src/modules/vector-store/pgvector.store.ts`
- Create: `commerce-ai-platform/src/modules/vector-store/vector-store.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`

**Interfaces:**
- Consumes: `OPENAI_API_KEY`, PostgreSQL connection string.
- Produces: Provider interfaces and vector store abstraction used by indexing/search/review modules.

- [ ] **Step 1: Define embedding provider interface**

Create `commerce-ai-platform/src/modules/providers/embedding-provider.interface.ts`:

```ts
export interface EmbeddingInput {
  text: string;
  metadata?: Record<string, unknown>;
}

export interface EmbeddingResult {
  vector: number[];
  model: string;
}

export interface EmbeddingProvider {
  embed(input: EmbeddingInput): Promise<EmbeddingResult>;
}

export const EMBEDDING_PROVIDER = Symbol('EMBEDDING_PROVIDER');
```

- [ ] **Step 2: Define chat provider interface**

Create `commerce-ai-platform/src/modules/providers/chat-provider.interface.ts`:

```ts
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatProvider {
  complete(messages: ChatMessage[]): Promise<string>;
}

export const CHAT_PROVIDER = Symbol('CHAT_PROVIDER');
```

- [ ] **Step 3: Implement OpenAI embedding provider**

Create `commerce-ai-platform/src/modules/providers/openai-embedding.provider.ts`:

```ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type { EmbeddingInput, EmbeddingProvider, EmbeddingResult } from './embedding-provider.interface';

@Injectable()
export class OpenAiEmbeddingProvider implements EmbeddingProvider {
  private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  private readonly model = process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small';

  async embed(input: EmbeddingInput): Promise<EmbeddingResult> {
    const response = await this.client.embeddings.create({
      model: this.model,
      input: input.text,
    });

    return {
      vector: response.data[0].embedding,
      model: this.model,
    };
  }
}
```

- [ ] **Step 4: Implement OpenAI chat provider**

Create `commerce-ai-platform/src/modules/providers/openai-chat.provider.ts`:

```ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type { ChatMessage, ChatProvider } from './chat-provider.interface';

@Injectable()
export class OpenAiChatProvider implements ChatProvider {
  private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  private readonly model = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4.1-mini';

  async complete(messages: ChatMessage[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.2,
    });

    return response.choices[0]?.message?.content ?? '';
  }
}
```

- [ ] **Step 5: Create providers module**

Create `commerce-ai-platform/src/modules/providers/providers.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { CHAT_PROVIDER } from './chat-provider.interface';
import { EMBEDDING_PROVIDER } from './embedding-provider.interface';
import { OpenAiChatProvider } from './openai-chat.provider';
import { OpenAiEmbeddingProvider } from './openai-embedding.provider';

@Module({
  providers: [
    { provide: EMBEDDING_PROVIDER, useClass: OpenAiEmbeddingProvider },
    { provide: CHAT_PROVIDER, useClass: OpenAiChatProvider },
  ],
  exports: [EMBEDDING_PROVIDER, CHAT_PROVIDER],
})
export class ProvidersModule {}
```

- [ ] **Step 6: Define vector store interface**

Create `commerce-ai-platform/src/modules/vector-store/vector-store.interface.ts`:

```ts
export interface ProductVectorRecord {
  productId: string;
  textHash: string;
  vector: number[];
  model: string;
}

export interface ProductSearchFilter {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
  limit: number;
}

export interface ProductVectorSearchResult {
  productId: string;
  score: number;
}

export interface VectorStore {
  upsertProductEmbedding(record: ProductVectorRecord): Promise<void>;
  searchProducts(vector: number[], filter: ProductSearchFilter): Promise<ProductVectorSearchResult[]>;
}

export const VECTOR_STORE = Symbol('VECTOR_STORE');
```

- [ ] **Step 7: Create pgvector store placeholder implementation**

Create `commerce-ai-platform/src/modules/vector-store/pgvector.store.ts`:

```ts
import { Injectable } from '@nestjs/common';
import type {
  ProductSearchFilter,
  ProductVectorRecord,
  ProductVectorSearchResult,
  VectorStore,
} from './vector-store.interface';

@Injectable()
export class PgVectorStore implements VectorStore {
  async upsertProductEmbedding(record: ProductVectorRecord): Promise<void> {
    void record;
  }

  async searchProducts(vector: number[], filter: ProductSearchFilter): Promise<ProductVectorSearchResult[]> {
    void vector;
    void filter;
    return [];
  }
}
```

- [ ] **Step 8: Register vector store module**

Create `commerce-ai-platform/src/modules/vector-store/vector-store.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { PgVectorStore } from './pgvector.store';
import { VECTOR_STORE } from './vector-store.interface';

@Module({
  providers: [{ provide: VECTOR_STORE, useClass: PgVectorStore }],
  exports: [VECTOR_STORE],
})
export class VectorStoreModule {}
```

- [ ] **Step 9: Import modules into app module**

Modify `commerce-ai-platform/src/app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ProvidersModule } from './modules/providers/providers.module';
import { VectorStoreModule } from './modules/vector-store/vector-store.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ProvidersModule, VectorStoreModule],
  controllers: [AppController],
})
export class AppModule {}
```

- [ ] **Step 10: Verify**

Run:

```bash
cd commerce-ai-platform
npm run build
npm test
```

Expected:

```txt
Build and tests complete successfully.
```

---

### Task 8: Implement Semantic Search API Contract

**Files:**
- Create: `commerce-ai-platform/src/modules/semantic-search/semantic-search.dto.ts`
- Create: `commerce-ai-platform/src/modules/semantic-search/semantic-search.service.ts`
- Create: `commerce-ai-platform/src/modules/semantic-search/semantic-search.controller.ts`
- Create: `commerce-ai-platform/src/modules/semantic-search/semantic-search.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`
- Create: `commerce-admin/src/modules/ai-search/AiSearchPage.tsx`
- Modify: `commerce-admin/src/routes/AppRoutes.tsx`

**Interfaces:**
- Consumes: `EmbeddingProvider`, `VectorStore`, AI API `POST /ai/search/products`.
- Produces: Semantic product search endpoint and admin page.

- [ ] **Step 1: Define semantic search DTO**

Create `commerce-ai-platform/src/modules/semantic-search/semantic-search.dto.ts`:

```ts
export interface ProductSearchFiltersDto {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
}

export interface SemanticProductSearchRequestDto {
  query: string;
  filters?: ProductSearchFiltersDto;
  limit?: number;
}

export interface SemanticProductSearchItemDto {
  productId: string;
  score: number;
  explanation: string;
}

export interface SemanticProductSearchResponseDto {
  items: SemanticProductSearchItemDto[];
}
```

- [ ] **Step 2: Implement semantic search service**

Create `commerce-ai-platform/src/modules/semantic-search/semantic-search.service.ts`:

```ts
import { Inject, Injectable } from '@nestjs/common';
import { CHAT_PROVIDER, type ChatProvider } from '../providers/chat-provider.interface';
import { EMBEDDING_PROVIDER, type EmbeddingProvider } from '../providers/embedding-provider.interface';
import { VECTOR_STORE, type VectorStore } from '../vector-store/vector-store.interface';
import type { SemanticProductSearchRequestDto, SemanticProductSearchResponseDto } from './semantic-search.dto';

@Injectable()
export class SemanticSearchService {
  constructor(
    @Inject(EMBEDDING_PROVIDER) private readonly embeddingProvider: EmbeddingProvider,
    @Inject(CHAT_PROVIDER) private readonly chatProvider: ChatProvider,
    @Inject(VECTOR_STORE) private readonly vectorStore: VectorStore,
  ) {}

  async searchProducts(request: SemanticProductSearchRequestDto): Promise<SemanticProductSearchResponseDto> {
    const embedding = await this.embeddingProvider.embed({ text: request.query });
    const results = await this.vectorStore.searchProducts(embedding.vector, {
      categoryId: request.filters?.categoryId,
      priceMin: request.filters?.priceMin,
      priceMax: request.filters?.priceMax,
      ratingMin: request.filters?.ratingMin,
      limit: request.limit ?? 20,
    });

    const items = await Promise.all(results.map(async (result) => ({
      productId: result.productId,
      score: result.score,
      explanation: await this.explainMatch(request.query, result.productId, result.score),
    })));

    return { items };
  }

  private async explainMatch(query: string, productId: string, score: number): Promise<string> {
    return this.chatProvider.complete([
      { role: 'system', content: 'Bạn giải thích ngắn gọn bằng tiếng Việt vì sao một sản phẩm phù hợp với câu search.' },
      { role: 'user', content: `Query: ${query}\nProduct ID: ${productId}\nSimilarity score: ${score}` },
    ]);
  }
}
```

- [ ] **Step 3: Implement semantic search controller**

Create `commerce-ai-platform/src/modules/semantic-search/semantic-search.controller.ts`:

```ts
import { Body, Controller, Post } from '@nestjs/common';
import type { SemanticProductSearchRequestDto } from './semantic-search.dto';
import { SemanticSearchService } from './semantic-search.service';

@Controller('/ai/search')
export class SemanticSearchController {
  constructor(private readonly semanticSearchService: SemanticSearchService) {}

  @Post('/products')
  searchProducts(@Body() body: SemanticProductSearchRequestDto) {
    return this.semanticSearchService.searchProducts(body);
  }
}
```

- [ ] **Step 4: Register semantic search module**

Create `commerce-ai-platform/src/modules/semantic-search/semantic-search.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ProvidersModule } from '../providers/providers.module';
import { VectorStoreModule } from '../vector-store/vector-store.module';
import { SemanticSearchController } from './semantic-search.controller';
import { SemanticSearchService } from './semantic-search.service';

@Module({
  imports: [ProvidersModule, VectorStoreModule],
  controllers: [SemanticSearchController],
  providers: [SemanticSearchService],
})
export class SemanticSearchModule {}
```

- [ ] **Step 5: Import semantic search module**

Modify `commerce-ai-platform/src/app.module.ts` to include:

```ts
SemanticSearchModule
```

- [ ] **Step 6: Create admin AI search page**

Create `commerce-admin/src/modules/ai-search/AiSearchPage.tsx`:

```tsx
import { Button, Form, Input, InputNumber, Table } from 'antd';
import { useState } from 'react';
import { aiApi } from '../../shared/api/http-client';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

interface SearchItem {
  productId: string;
  score: number;
  explanation: string;
}

export function AiSearchPage() {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleFinish(values: { query: string; limit?: number }) {
    setLoading(true);
    try {
      const response = await aiApi.post<{ items: SearchItem[] }>('/ai/search/products', {
        query: values.query,
        limit: values.limit ?? 20,
      });
      setItems(response.data.items);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <DataPageHeader title="AI Search" description="Semantic product search với filters và explanation." actions={null} />
      <Form layout="inline" onFinish={handleFinish} style={{ marginBottom: 16 }}>
        <Form.Item name="query" rules={[{ required: true, message: 'Nhập câu search' }]} style={{ minWidth: 420 }}>
          <Input placeholder="Ví dụ: áo khoác chống nước đi du lịch mùa mưa" />
        </Form.Item>
        <Form.Item name="limit" initialValue={20}>
          <InputNumber min={1} max={50} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Search</Button>
      </Form>
      <Table
        rowKey="productId"
        dataSource={items}
        columns={[
          { title: 'Product ID', dataIndex: 'productId' },
          { title: 'Score', dataIndex: 'score' },
          { title: 'Explanation', dataIndex: 'explanation' },
        ]}
      />
    </>
  );
}
```

- [ ] **Step 7: Wire AI search route**

Modify `commerce-admin/src/routes/AppRoutes.tsx`:

```tsx
import { AiSearchPage } from '../modules/ai-search/AiSearchPage';
```

Route:

```tsx
<Route path="/ai-search" element={<AiSearchPage />} />
```

- [ ] **Step 8: Verify**

Run:

```bash
cd commerce-ai-platform && npm run build
cd ../commerce-admin && npm run build
```

Expected:

```txt
Both builds complete successfully.
```

---

### Task 9: Implement Text-to-SQL Safety Foundation

**Files:**
- Create: `commerce-ai-platform/src/modules/sql-safety/sql-safety.types.ts`
- Create: `commerce-ai-platform/src/modules/sql-safety/sql-safety.service.ts`
- Create: `commerce-ai-platform/src/modules/sql-safety/sql-safety.service.spec.ts`
- Create: `commerce-ai-platform/src/modules/sql-safety/sql-safety.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`

**Interfaces:**
- Consumes: Generated SQL string.
- Produces: `SqlSafetyResult` used by Analyst Chat before executing SQL.

- [ ] **Step 1: Define SQL safety types**

Create `commerce-ai-platform/src/modules/sql-safety/sql-safety.types.ts`:

```ts
export interface SqlSafetyResult {
  allowed: boolean;
  reason: string | null;
  normalizedSql: string | null;
}
```

- [ ] **Step 2: Write failing tests**

Create `commerce-ai-platform/src/modules/sql-safety/sql-safety.service.spec.ts`:

```ts
import { SqlSafetyService } from './sql-safety.service';

describe('SqlSafetyService', () => {
  const service = new SqlSafetyService();

  it('allows a single select statement on analytics views', () => {
    const result = service.validate('select * from analytics.product_performance limit 10');
    expect(result.allowed).toBe(true);
    expect(result.normalizedSql).toContain('limit 10');
  });

  it('blocks update statements', () => {
    const result = service.validate('update marketplace.products set title = "x"');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Only SELECT');
  });

  it('blocks multiple statements', () => {
    const result = service.validate('select * from analytics.product_performance; drop table marketplace.products');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('single statement');
  });

  it('blocks non-whitelisted schemas', () => {
    const result = service.validate('select * from pg_catalog.pg_tables');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('whitelist');
  });

  it('adds default limit when missing', () => {
    const result = service.validate('select * from analytics.category_summary');
    expect(result.allowed).toBe(true);
    expect(result.normalizedSql).toBe('select * from analytics.category_summary limit 100');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run:

```bash
cd commerce-ai-platform
npm test -- sql-safety.service.spec.ts
```

Expected:

```txt
FAIL because SqlSafetyService does not exist.
```

- [ ] **Step 4: Implement SQL safety service**

Create `commerce-ai-platform/src/modules/sql-safety/sql-safety.service.ts`:

```ts
import { Injectable } from '@nestjs/common';
import type { SqlSafetyResult } from './sql-safety.types';

const blockedKeywords = [
  'insert',
  'update',
  'delete',
  'drop',
  'alter',
  'truncate',
  'create',
  'grant',
  'revoke',
  'copy',
  'vacuum',
];

const allowedRelations = [
  'analytics.product_performance',
  'analytics.review_sentiment',
  'analytics.seller_performance',
  'analytics.category_summary',
  'marketplace.products',
  'marketplace.reviews',
  'marketplace.categories',
  'marketplace.sellers',
];

@Injectable()
export class SqlSafetyService {
  validate(sql: string): SqlSafetyResult {
    const normalized = sql.trim().replace(/;$/, '').replace(/\s+/g, ' ').toLowerCase();

    if (normalized.includes(';')) {
      return { allowed: false, reason: 'SQL must be a single statement', normalizedSql: null };
    }

    if (!normalized.startsWith('select ')) {
      return { allowed: false, reason: 'Only SELECT statements are allowed', normalizedSql: null };
    }

    for (const keyword of blockedKeywords) {
      if (new RegExp(`\\b${keyword}\\b`, 'i').test(normalized)) {
        return { allowed: false, reason: 'Only SELECT statements are allowed', normalizedSql: null };
      }
    }

    const hasAllowedRelation = allowedRelations.some((relation) => normalized.includes(relation));
    if (!hasAllowedRelation) {
      return { allowed: false, reason: 'SQL relation is outside whitelist', normalizedSql: null };
    }

    const limited = /\blimit\s+\d+\b/i.test(normalized) ? normalized : `${normalized} limit 100`;
    return { allowed: true, reason: null, normalizedSql: limited };
  }
}
```

- [ ] **Step 5: Register SQL safety module**

Create `commerce-ai-platform/src/modules/sql-safety/sql-safety.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { SqlSafetyService } from './sql-safety.service';

@Module({
  providers: [SqlSafetyService],
  exports: [SqlSafetyService],
})
export class SqlSafetyModule {}
```

- [ ] **Step 6: Run test to verify it passes**

Run:

```bash
cd commerce-ai-platform
npm test -- sql-safety.service.spec.ts
```

Expected:

```txt
PASS
```

---

### Task 10: Implement Analyst Chat Contract

**Files:**
- Create: `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.dto.ts`
- Create: `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.service.ts`
- Create: `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.controller.ts`
- Create: `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.module.ts`
- Modify: `commerce-ai-platform/src/app.module.ts`
- Create: `commerce-admin/src/modules/analyst-chat/AnalystChatPage.tsx`
- Modify: `commerce-admin/src/routes/AppRoutes.tsx`

**Interfaces:**
- Consumes: `ChatProvider`, `SqlSafetyService`, read-only database execution adapter.
- Produces: AI Analyst API and admin chat UI.

- [ ] **Step 1: Define analyst chat DTO**

Create `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.dto.ts`:

```ts
export interface AnalystChatRequestDto {
  question: string;
  sessionId?: string;
}

export interface AnalystChatResponseDto {
  answer: string;
  generatedSql: string | null;
  columns: string[];
  rows: Array<Record<string, unknown>>;
  chartSuggestion: 'none' | 'table' | 'bar' | 'line' | 'pie';
  safetyStatus: 'allowed' | 'blocked';
  queryLogId: string | null;
}
```

- [ ] **Step 2: Implement analyst chat service with safe blocked default**

Create `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.service.ts`:

```ts
import { Inject, Injectable } from '@nestjs/common';
import { CHAT_PROVIDER, type ChatProvider } from '../providers/chat-provider.interface';
import { SqlSafetyService } from '../sql-safety/sql-safety.service';
import type { AnalystChatRequestDto, AnalystChatResponseDto } from './analyst-chat.dto';

@Injectable()
export class AnalystChatService {
  constructor(
    @Inject(CHAT_PROVIDER) private readonly chatProvider: ChatProvider,
    private readonly sqlSafetyService: SqlSafetyService,
  ) {}

  async ask(request: AnalystChatRequestDto): Promise<AnalystChatResponseDto> {
    const generatedSql = await this.generateSql(request.question);
    const safety = this.sqlSafetyService.validate(generatedSql);

    if (!safety.allowed) {
      return {
        answer: `Không chạy SQL vì query không an toàn: ${safety.reason}`,
        generatedSql,
        columns: [],
        rows: [],
        chartSuggestion: 'none',
        safetyStatus: 'blocked',
        queryLogId: null,
      };
    }

    return {
      answer: 'SQL đã qua safety validator. DB execution adapter sẽ được nối ở task sau.',
      generatedSql: safety.normalizedSql,
      columns: [],
      rows: [],
      chartSuggestion: 'table',
      safetyStatus: 'allowed',
      queryLogId: null,
    };
  }

  private async generateSql(question: string): Promise<string> {
    return this.chatProvider.complete([
      {
        role: 'system',
        content: [
          'Bạn sinh đúng một câu SQL SELECT cho PostgreSQL.',
          'Chỉ dùng analytics.product_performance, analytics.review_sentiment, analytics.seller_performance, analytics.category_summary.',
          'Không sinh INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE.',
        ].join(' '),
      },
      { role: 'user', content: question },
    ]);
  }
}
```

- [ ] **Step 3: Implement analyst chat controller**

Create `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.controller.ts`:

```ts
import { Body, Controller, Post } from '@nestjs/common';
import type { AnalystChatRequestDto } from './analyst-chat.dto';
import { AnalystChatService } from './analyst-chat.service';

@Controller('/ai/analyst')
export class AnalystChatController {
  constructor(private readonly analystChatService: AnalystChatService) {}

  @Post('/chat')
  ask(@Body() body: AnalystChatRequestDto) {
    return this.analystChatService.ask(body);
  }
}
```

- [ ] **Step 4: Register analyst chat module**

Create `commerce-ai-platform/src/modules/analyst-chat/analyst-chat.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ProvidersModule } from '../providers/providers.module';
import { SqlSafetyModule } from '../sql-safety/sql-safety.module';
import { AnalystChatController } from './analyst-chat.controller';
import { AnalystChatService } from './analyst-chat.service';

@Module({
  imports: [ProvidersModule, SqlSafetyModule],
  controllers: [AnalystChatController],
  providers: [AnalystChatService],
})
export class AnalystChatModule {}
```

- [ ] **Step 5: Create admin analyst page**

Create `commerce-admin/src/modules/analyst-chat/AnalystChatPage.tsx`:

```tsx
import { Button, Card, Form, Input, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import { aiApi } from '../../shared/api/http-client';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

interface AnalystResponse {
  answer: string;
  generatedSql: string | null;
  columns: string[];
  rows: Array<Record<string, unknown>>;
  chartSuggestion: string;
  safetyStatus: string;
  queryLogId: string | null;
}

export function AnalystChatPage() {
  const [response, setResponse] = useState<AnalystResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFinish(values: { question: string }) {
    setLoading(true);
    try {
      const result = await aiApi.post<AnalystResponse>('/ai/analyst/chat', values);
      setResponse(result.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <DataPageHeader title="AI Analyst" description="Hỏi dữ liệu marketplace bằng tiếng Việt qua text-to-SQL an toàn." actions={null} />
      <Form layout="vertical" onFinish={handleFinish}>
        <Form.Item name="question" rules={[{ required: true, message: 'Nhập câu hỏi' }]}>
          <Input.TextArea rows={3} placeholder="Ví dụ: Top 10 sản phẩm có review tiêu cực nhiều nhất là gì?" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Hỏi AI</Button>
      </Form>
      {response ? (
        <Card>
          <Typography.Paragraph>{response.answer}</Typography.Paragraph>
          {response.generatedSql ? <Typography.Text code>{response.generatedSql}</Typography.Text> : null}
          <Table
            style={{ marginTop: 16 }}
            dataSource={response.rows}
            columns={response.columns.map((column) => ({ title: column, dataIndex: column }))}
            rowKey={(_, index) => String(index)}
          />
        </Card>
      ) : null}
    </Space>
  );
}
```

- [ ] **Step 6: Wire analyst route**

Modify `commerce-admin/src/routes/AppRoutes.tsx`:

```tsx
import { AnalystChatPage } from '../modules/analyst-chat/AnalystChatPage';
```

Route:

```tsx
<Route path="/analyst-chat" element={<AnalystChatPage />} />
```

- [ ] **Step 7: Verify**

Run:

```bash
cd commerce-ai-platform && npm run build && npm test
cd ../commerce-admin && npm run build
```

Expected:

```txt
AI Platform tests pass and both builds complete successfully.
```

---

### Task 11: Create Full Docker Infra

**Files:**
- Create: `commerce-platform-infra/.env.example`
- Create: `commerce-platform-infra/docker-compose.yml`
- Create: `commerce-platform-infra/postgres/init/001-init.sql`
- Modify: `commerce-platform-infra/README.md`

**Interfaces:**
- Consumes: Dockerfiles from admin/core/AI repos.
- Produces: Full system local runtime.

- [ ] **Step 1: Create infra folders**

Run:

```bash
mkdir -p commerce-platform-infra/postgres/init
```

- [ ] **Step 2: Create env example**

Create `commerce-platform-infra/.env.example`:

```env
POSTGRES_DB=commerce
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
CORE_API_PORT=8080
AI_API_PORT=3001
ADMIN_PORT=5173
MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=minio123
OPENAI_API_KEY=
```

- [ ] **Step 3: Create PostgreSQL init script**

Create `commerce-platform-infra/postgres/init/001-init.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS marketplace;
CREATE SCHEMA IF NOT EXISTS ingestion;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS analytics;

CREATE USER ai_readonly WITH PASSWORD 'ai_readonly';
GRANT USAGE ON SCHEMA identity, marketplace, ingestion, analytics TO ai_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA identity, marketplace, ingestion, analytics TO ai_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA identity, marketplace, ingestion, analytics GRANT SELECT ON TABLES TO ai_readonly;
```

- [ ] **Step 4: Create docker-compose**

Create `commerce-platform-infra/docker-compose.yml`:

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-commerce}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-commerce}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minio}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minio123}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  core-service:
    build: ../commerce-core-service
    environment:
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/commerce
    ports:
      - "${CORE_API_PORT:-8080}:8080"
    depends_on:
      postgres:
        condition: service_healthy

  ai-platform:
    build: ../commerce-ai-platform
    environment:
      PORT: 3001
      CORE_API_BASE_URL: http://core-service:8080
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/commerce
      REDIS_URL: redis://redis:6379
      OPENAI_API_KEY: ${OPENAI_API_KEY:-}
    ports:
      - "${AI_API_PORT:-3001}:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  admin:
    build: ../commerce-admin
    ports:
      - "${ADMIN_PORT:-5173}:80"
    depends_on:
      - core-service
      - ai-platform

volumes:
  postgres_data:
  minio_data:
```

- [ ] **Step 5: Update infra README**

Modify `commerce-platform-infra/README.md` to include:

````markdown
## Run Full System

```bash
cp .env.example .env
docker compose up --build
```

Admin:

```txt
http://localhost:5173
```

AI health:

```txt
http://localhost:3001/health
```

MinIO console:

```txt
http://localhost:9001
```
````

- [ ] **Step 6: Verify infra config**

Run:

```bash
cd commerce-platform-infra
docker compose config
```

Expected:

```txt
Compose config renders without errors.
```

---

### Task 12: Final Phase 1 Verification Checklist

**Files:**
- Create: `docs/verification/phase-1-checklist.md`

**Interfaces:**
- Consumes: All previous tasks.
- Produces: Manual verification checklist for phase 1.

- [ ] **Step 1: Create verification folder**

Run:

```bash
mkdir -p docs/verification
```

- [ ] **Step 2: Create checklist**

Create `docs/verification/phase-1-checklist.md`:

```markdown
# Phase 1 Verification Checklist

## Infra

- [ ] `docker compose config` passes in `commerce-platform-infra`.
- [ ] `docker compose up --build` starts Postgres, Redis, MinIO, core-service, ai-platform and admin.
- [ ] AI Platform health endpoint returns `{"status":"ok","service":"commerce-ai-platform"}`.

## Core-Service Contract

- [ ] `POST /auth/login` returns token and user.
- [ ] `GET /auth/me` returns current user.
- [ ] `GET /auth/me/permissions` or equivalent returns permission codes.
- [ ] Category APIs exist.
- [ ] Seller APIs exist.
- [ ] Product APIs exist.
- [ ] Review APIs exist.
- [ ] Data source/import/sync run APIs exist.
- [ ] Analytics views/API exist for AI analyst.

## Admin CMS

- [ ] Admin build passes.
- [ ] Login page renders.
- [ ] Permission-based menu renders.
- [ ] Category page calls Core API.
- [ ] Seller/Product/Review/Ingestion pages exist.
- [ ] AI Search page calls AI API.
- [ ] AI Analyst page calls AI API.

## AI Platform

- [ ] AI build passes.
- [ ] Provider interfaces compile.
- [ ] Vector store interface compiles.
- [ ] Semantic search endpoint exists.
- [ ] SQL safety tests pass.
- [ ] Analyst chat endpoint blocks unsafe SQL.

## Data And AI

- [ ] Realistic dataset can be created/imported through ingestion flow.
- [ ] Product embeddings can be generated.
- [ ] Semantic search returns score and explanation.
- [ ] Review intelligence produces sentiment/topics/product summary.
- [ ] Text-to-SQL returns answer, SQL, table and safety status.
```

- [ ] **Step 3: Verify docs exist**

Run:

```bash
find docs -type f | sort
```

Expected:

```txt
The output includes docs/verification/phase-1-checklist.md and all design/plan docs.
```

---

## Self-Review

Spec coverage:

- Repo boundary covered by Tasks 1 and 11.
- Core Java responsibilities covered by Task 2 without prescribing Java implementation code.
- Admin FE covered by Tasks 3, 4, 5, 8 and 10.
- AI Platform covered by Tasks 6, 7, 8, 9 and 10.
- Infra covered by Task 11.
- Verification covered by Task 12.
- Realistic dataset is documented and expected through Core/import flow; detailed generator implementation should be a separate future plan after Core schema is available.

Placeholder scan:

- This plan intentionally avoids placeholder tokens and vague catch-all wording.
- Core Java remains a responsibility brief by user request.

Type consistency:

- Admin API clients use `coreApi` and `aiApi`.
- AI provider interfaces are consumed by semantic search and analyst chat.
- SQL safety returns `SqlSafetyResult` and analyst chat uses `allowed`, `reason`, `normalizedSql`.
