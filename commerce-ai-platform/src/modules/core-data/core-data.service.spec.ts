import { buildProductSourceText } from './core-data.service';
import type { CoreProductRecord } from './core-data.types';

describe('buildProductSourceText', () => {
  it('includes searchable product fields', () => {
    const product: CoreProductRecord = {
      id: 'p1',
      title: 'Kem chống nắng SPF50+',
      slug: 'kem-chong-nang',
      brand: 'Anessa',
      description: 'Phù hợp da dầu',
      status: 'ACTIVE',
      priceMin: 200000,
      priceMax: 300000,
      ratingAvg: 4.6,
      reviewCount: 12,
      categoryName: 'Beauty',
      categoryPath: 'beauty/skincare',
      sellerName: 'Shop A',
      specsJson: { skin_type: 'oily', spf: '50+' },
    };

    const text = buildProductSourceText(product);
    expect(text).toContain('Kem chống nắng SPF50+');
    expect(text).toContain('Beauty');
    expect(text).toContain('skin_type: oily');
  });
});
