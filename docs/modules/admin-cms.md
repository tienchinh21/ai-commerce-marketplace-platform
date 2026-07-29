# Admin CMS

Stack:

```txt
React + Vite + Ant Design
```

Admin là UI/BFF mỏng, không sở hữu business logic.

## Screens Phase 1

```txt
Dashboard
Sellers
Buyers
Categories
Category Attributes
Products
Product Detail
Reviews
Data Sources
Imports / Sync Runs
Raw Snapshots
AI Search
Review Intelligence
AI Analyst Chat
Users & Permissions
```

## Layout

```txt
Login
Main Layout
  Sidebar
  Header user/session
  Permission-based menu
  Content area
```

## Implementation Priority

```txt
1. Login/layout/permission menu
2. Category/category attributes
3. Seller/product/product detail
4. Review
5. Data source/import/sync run/raw snapshot
6. AI Search
7. Review Intelligence
8. AI Analyst Chat
9. Dashboard polish
```

## UX Direction

Admin là data-operation tool:

- nhiều table;
- filter rõ;
- drawer/modal form;
- bulk action khi cần;
- trạng thái import/sync/job rõ ràng;
- AI feature nằm trong workflow quản trị, không tách thành demo rời.

