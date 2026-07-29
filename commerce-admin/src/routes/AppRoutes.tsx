import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { LoginPage } from '../modules/auth/LoginPage';
import { useAuth } from '../modules/auth/auth.store';
import { DashboardPage } from '../modules/dashboard/DashboardPage';
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
