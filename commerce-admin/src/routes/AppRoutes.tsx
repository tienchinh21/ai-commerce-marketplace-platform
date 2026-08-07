import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { LoginPage } from '@/modules/auth/LoginPage';
import { useAuth } from '@/modules/auth/auth.store';
import { DashboardPage } from '@/modules/dashboard/DashboardPage';
import { CategoriesPage } from '@/modules/categories/CategoriesPage';
import { SellersPage } from '@/modules/sellers/SellersPage';
import { BuyersPage } from '@/modules/buyers/BuyersPage';
import { ProductsPage } from '@/modules/products/ProductsPage';
import { ProductDetailPage } from '@/modules/products/ProductDetailPage';
import { ReviewsPage } from '@/modules/reviews/ReviewsPage';
import { IngestionPage } from '@/modules/ingestion/IngestionPage';
import { AiSearchPage } from '@/modules/ai-search/AiSearchPage';
import { ReviewIntelligencePage } from '@/modules/review-intelligence/ReviewIntelligencePage';
import { AnalystChatPage } from '@/modules/analyst-chat/AnalystChatPage';
import { UsersPermissionsPage } from '@/modules/users-permissions/UsersPermissionsPage';
import { ROUTES } from '@/shared/constants/routes.constants';

function ProtectedLayout() {
  const auth = useAuth();
  if (!auth.token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <AdminLayout />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
          <Route path={ROUTES.SELLERS} element={<SellersPage />} />
          <Route path={ROUTES.BUYERS} element={<BuyersPage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
          <Route path={`${ROUTES.PRODUCTS}/:productId`} element={<ProductDetailPage />} />
          <Route path={ROUTES.REVIEWS} element={<ReviewsPage />} />
          <Route path={ROUTES.INGESTION} element={<IngestionPage />} />
          <Route path={ROUTES.AI_SEARCH} element={<AiSearchPage />} />
          <Route path={ROUTES.REVIEW_INTELLIGENCE} element={<ReviewIntelligencePage />} />
          <Route path={ROUTES.ANALYST_CHAT} element={<AnalystChatPage />} />
          <Route path={ROUTES.USERS_PERMISSIONS} element={<UsersPermissionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
