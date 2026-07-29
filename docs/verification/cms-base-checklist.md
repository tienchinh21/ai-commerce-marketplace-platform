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
