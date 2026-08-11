import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp } from 'antd';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ProductDetailPage } from './ProductDetailPage';
import { fetchProductDetail } from './product.api';

vi.mock('./product.api', () => ({
  fetchProductDetail: vi.fn(),
}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal('ResizeObserver', ResizeObserver);
  vi.stubGlobal('getComputedStyle', () => ({
    getPropertyValue: () => '',
  }));
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <AntApp>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/products/product-id']}>
          <Routes>
            <Route path="/products/:productId" element={children} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </AntApp>
  );
}

describe('ProductDetailPage', () => {
  it('renders seller and category names from detail response objects', async () => {
    vi.mocked(fetchProductDetail).mockResolvedValueOnce({
      id: 'product-id',
      sellerId: 'seller-id',
      categoryId: 'category-id',
      seller: { id: 'seller-id', name: 'Anker Official Store' },
      category: { id: 'category-id', name: 'Tai nghe' },
      title: 'Tai nghe Anker',
      slug: 'tai-nghe-anker',
      brand: 'Anker',
      status: 'ACTIVE',
      priceMin: '100000',
      priceMax: '200000',
      ratingAvg: '4.5',
      reviewCount: 12,
      createdAt: '2026-08-07T00:00:00.000Z',
      updatedAt: '2026-08-07T00:00:00.000Z',
      description: null,
      specsJson: {},
      variants: [],
      images: [],
    });

    render(<ProductDetailPage />, { wrapper });

    expect(await screen.findByText('Anker Official Store')).toBeTruthy();
    expect(screen.getByText('Tai nghe')).toBeTruthy();
  });
});
