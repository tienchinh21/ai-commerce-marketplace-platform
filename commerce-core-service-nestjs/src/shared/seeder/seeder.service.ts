import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../modules/auth/user.entity';
import { Permission } from '../../modules/auth/permission.entity';
import { UserPermission } from '../../modules/auth/user-permission.entity';
import { PERMISSIONS } from '../../modules/auth/permissions.const';
import { Category } from '../../modules/categories/category.entity';
import { CategoryAttribute } from '../../modules/categories/category-attribute.entity';
import { Seller } from '../../modules/sellers/seller.entity';
import { Buyer } from '../../modules/buyers/buyer.entity';
import { Product } from '../../modules/products/product.entity';
import { ProductVariant } from '../../modules/products/product-variant.entity';
import { Review } from '../../modules/reviews/review.entity';

interface SeedCategory {
  name: string;
  slug: string;
  attributes: Array<{
    code: string;
    label: string;
    dataType: string;
    isFilterable: boolean;
    isSearchable: boolean;
    isRequired: boolean;
    unit?: string | null;
    options?: string[];
  }>;
}

const SEED_CATEGORIES: SeedCategory[] = [
  {
    name: 'Electronics',
    slug: 'electronics',
    attributes: [
      {
        code: 'brand',
        label: 'Thương hiệu',
        dataType: 'text',
        isFilterable: true,
        isSearchable: true,
        isRequired: true,
      },
      {
        code: 'ram',
        label: 'RAM',
        dataType: 'text',
        isFilterable: true,
        isSearchable: true,
        isRequired: false,
        unit: 'GB',
      },
      {
        code: 'storage',
        label: 'Bộ nhớ',
        dataType: 'text',
        isFilterable: true,
        isSearchable: false,
        isRequired: false,
        unit: 'GB',
      },
      {
        code: 'screen_size',
        label: 'Kích thước màn hình',
        dataType: 'text',
        isFilterable: false,
        isSearchable: false,
        isRequired: false,
        unit: 'inch',
      },
      {
        code: 'warranty_months',
        label: 'Bảo hành',
        dataType: 'number',
        isFilterable: false,
        isSearchable: false,
        isRequired: false,
        unit: 'tháng',
      },
    ],
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    attributes: [
      {
        code: 'brand',
        label: 'Thương hiệu',
        dataType: 'text',
        isFilterable: true,
        isSearchable: true,
        isRequired: true,
      },
      {
        code: 'size',
        label: 'Kích cỡ',
        dataType: 'select',
        isFilterable: true,
        isSearchable: false,
        isRequired: true,
        options: ['S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        code: 'color',
        label: 'Màu sắc',
        dataType: 'select',
        isFilterable: true,
        isSearchable: false,
        isRequired: false,
        options: ['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Nâu'],
      },
      {
        code: 'material',
        label: 'Chất liệu',
        dataType: 'text',
        isFilterable: false,
        isSearchable: true,
        isRequired: false,
      },
      {
        code: 'gender',
        label: 'Giới tính',
        dataType: 'select',
        isFilterable: true,
        isSearchable: false,
        isRequired: false,
        options: ['Unisex', 'Nam', 'Nữ'],
      },
    ],
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    attributes: [
      {
        code: 'brand',
        label: 'Thương hiệu',
        dataType: 'text',
        isFilterable: true,
        isSearchable: true,
        isRequired: true,
      },
      {
        code: 'skin_type',
        label: 'Loại da',
        dataType: 'select',
        isFilterable: true,
        isSearchable: true,
        isRequired: false,
        options: [
          'Mọi loại da',
          'Da dầu',
          'Da khô',
          'Da nhạy cảm',
          'Da hỗn hợp',
        ],
      },
      {
        code: 'volume',
        label: 'Dung tích',
        dataType: 'text',
        isFilterable: false,
        isSearchable: false,
        isRequired: false,
        unit: 'ml',
      },
      {
        code: 'ingredients',
        label: 'Thành phần',
        dataType: 'text',
        isFilterable: false,
        isSearchable: false,
        isRequired: false,
      },
      {
        code: 'origin',
        label: 'Xuất xứ',
        dataType: 'text',
        isFilterable: false,
        isSearchable: false,
        isRequired: false,
      },
    ],
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    attributes: [
      {
        code: 'brand',
        label: 'Thương hiệu',
        dataType: 'text',
        isFilterable: true,
        isSearchable: true,
        isRequired: true,
      },
      {
        code: 'material',
        label: 'Chất liệu',
        dataType: 'text',
        isFilterable: true,
        isSearchable: true,
        isRequired: false,
      },
      {
        code: 'room_type',
        label: 'Phòng',
        dataType: 'select',
        isFilterable: true,
        isSearchable: false,
        isRequired: false,
        options: ['Phòng khách', 'Phòng ngủ', 'Bếp', 'Phòng tắm'],
      },
      {
        code: 'dimensions',
        label: 'Kích thước',
        dataType: 'text',
        isFilterable: false,
        isSearchable: false,
        isRequired: false,
        unit: 'cm',
      },
      {
        code: 'color',
        label: 'Màu sắc',
        dataType: 'text',
        isFilterable: true,
        isSearchable: false,
        isRequired: false,
      },
    ],
  },
  {
    name: 'Sports & Outdoor',
    slug: 'sports-outdoor',
    attributes: [
      {
        code: 'brand',
        label: 'Thương hiệu',
        dataType: 'text',
        isFilterable: true,
        isSearchable: true,
        isRequired: true,
      },
      {
        code: 'activity_type',
        label: 'Hoạt động',
        dataType: 'select',
        isFilterable: true,
        isSearchable: true,
        isRequired: false,
        options: ['Chạy bộ', 'Cầu lông', 'Bóng đá', 'Leo núi', 'Bơi'],
      },
      {
        code: 'size',
        label: 'Kích cỡ',
        dataType: 'select',
        isFilterable: true,
        isSearchable: false,
        isRequired: false,
        options: ['S', 'M', 'L', 'XL'],
      },
      {
        code: 'material',
        label: 'Chất liệu',
        dataType: 'text',
        isFilterable: false,
        isSearchable: true,
        isRequired: false,
      },
      {
        code: 'waterproof',
        label: 'Chống nước',
        dataType: 'boolean',
        isFilterable: true,
        isSearchable: false,
        isRequired: false,
      },
    ],
  },
];

const SEED_SELLERS = [
  'TechStore VN',
  'Thế Giới Số',
  'Fashion House',
  'Áo Quần Việt',
  'BeautyMart',
  'Mỹ Phẩm Xinh',
  'Nhà Xinh Home',
  'Nội Thất Phố',
  'SportZone',
  'Thể Thao 247',
];

const SEED_PRODUCT_TITLES: Record<string, string[]> = {
  electronics: [
    'Điện thoại thông minh Pro Max 256GB',
    'Laptop văn phòng mỏng nhẹ 14 inch',
    'Tai nghe không dây chống ồn',
    'Máy tính bảng 10.9 inch 128GB',
    'Sạc dự phòng 20000mAh',
  ],
  fashion: [
    'Áo khoác gió chống nước nam',
    'Áo thun cotton 100% unisex',
    'Quần jeans nam slim fit',
    'Đầm dạo phố nữ thời trang',
    'Giày sneaker thể thao năng động',
  ],
  beauty: [
    'Kem dưỡng ẩm da mặt 50g',
    'Sữa rửa mặt dịu nhẹ cho da nhạy cảm',
    'Serum vitamin C làm sáng da',
    'Nước hoa hồng cân bằng da',
    'Kem chống nắng SPF50+',
  ],
  'home-living': [
    'Đèn bàn học LED chống cận',
    'Ghế sofa vải 3 chỗ ngồi',
    'Bộ chăn ga gối cotton 4 món',
    'Kệ gỗ đa năng phòng khách',
    'Máy lọc không khí phòng ngủ',
  ],
  'sports-outdoor': [
    'Giày chạy bộ nam siêu nhẹ',
    'Balo chống nước đi phượt',
    'Vợt cầu lông carbon cao cấp',
    'Áo khoác leo núi chống gió',
    'Bình giữ nhiệt 750ml',
  ],
};

const REVIEW_TEMPLATES = [
  {
    rating: 5,
    title: 'Rất hài lòng',
    content:
      'Sản phẩm đúng như mô tả, chất lượng tốt, đóng gói cẩn thận. Rất đáng tiền!',
  },
  {
    rating: 5,
    title: 'Tuyệt vời',
    content:
      'Chất lượng vượt mong đợi, giá hợp lý so với chất lượng. Sẽ giới thiệu cho bạn bè.',
  },
  {
    rating: 4,
    title: 'Tốt',
    content:
      'Sản phẩm tốt, giao hàng nhanh. Trừ một chút về đóng gói nhưng nhìn chung hài lòng.',
  },
  {
    rating: 3,
    title: 'Bình thường',
    content:
      'Sản phẩm ổn, đúng giá tiền nhưng không có gì nổi bật. Chất liệu tạm được.',
  },
  {
    rating: 2,
    title: 'Không như mong đợi',
    content:
      'Chất lượng khá thất vọng so với giá tiền. Đã liên hệ hỗ trợ nhưng phản hồi chậm.',
  },
  {
    rating: 1,
    title: 'Rất tệ',
    content:
      'Sản phẩm lỗi ngay khi nhận hàng. Không nên mua ở đây, hoàn tiền mất nhiều thời gian.',
  },
];

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissions: Repository<Permission>,
    @InjectRepository(UserPermission)
    private readonly userPermissions: Repository<UserPermission>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Seller) private readonly sellers: Repository<Seller>,
    @InjectRepository(Buyer) private readonly buyers: Repository<Buyer>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variants: Repository<ProductVariant>,
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    private readonly dataSource: DataSource,
  ) {}

  async seed(): Promise<void> {
    await this.seedPermissions();
    await this.seedAdminUser();
    if ((await this.categories.count()) === 0) {
      await this.seedCatalog();
      await this.seedReviewsAndBuyers();
    }
    this.logger.log('Seeding completed');
  }

  private async seedPermissions(): Promise<void> {
    for (const code of PERMISSIONS) {
      const existing = await this.permissions.findOne({ where: { code } });
      if (!existing) {
        await this.permissions.save(this.permissions.create({ code }));
      }
    }
  }

  private async seedAdminUser(): Promise<void> {
    const email = 'admin@example.com';
    const existing = await this.users.findOne({ where: { email } });
    if (existing) return;

    const user = await this.users.save(
      this.users.create({
        email,
        passwordHash: await bcrypt.hash('admin123', 10),
        displayName: 'Admin',
        status: 'ACTIVE',
      }),
    );

    const allPermissions = await this.permissions.find();
    await this.userPermissions.save(
      allPermissions.map((permission) =>
        this.userPermissions.create({ user, permission }),
      ),
    );
    this.logger.log(`Seeded admin user ${email} / admin123`);
  }

  private async seedCatalog(): Promise<void> {
    const categories = new Map<string, Category>();
    for (const seedCategory of SEED_CATEGORIES) {
      const category = await this.categories.save(
        this.categories.create({
          parentId: null,
          name: seedCategory.name,
          slug: seedCategory.slug,
          path: '',
          level: 0,
          status: 'ACTIVE',
        }),
      );
      categories.set(seedCategory.slug, category);

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CategoryAttribute)
        .values(
          seedCategory.attributes.map((attribute) => ({
            category,
            code: attribute.code,
            label: attribute.label,
            dataType: attribute.dataType,
            isFilterable: attribute.isFilterable,
            isSearchable: attribute.isSearchable,
            isRequired: attribute.isRequired,
            unit: attribute.unit ?? null,
            optionsJson: 'options' in attribute ? attribute.options : null,
          })),
        )
        .execute();
    }

    const sellerEntities: Seller[] = [];
    for (const name of SEED_SELLERS) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      sellerEntities.push(
        await this.sellers.save(
          this.sellers.create({
            name,
            slug,
            status: 'ACTIVE',
            ratingAvg: '0',
            metadataJson: {},
          }),
        ),
      );
    }

    const products: Product[] = [];
    for (const [slug, titles] of Object.entries(SEED_PRODUCT_TITLES)) {
      const category = categories.get(slug)!;
      for (const title of titles) {
        const productSlug = `${slug}-${title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 100)}`;
        const seller =
          sellerEntities[Math.floor(Math.random() * sellerEntities.length)];
        const price =
          100_000 + Math.floor((Math.random() * 4_900_000) / 100_000) * 100_000;
        const priceMax =
          price + Math.floor((Math.random() * 500_000) / 100_000) * 100_000;
        const product = this.products.create({
          sellerId: seller.id,
          categoryId: category.id,
          title,
          slug: productSlug,
          brand: [
            'Samsung',
            'Apple',
            'Nike',
            'Adidas',
            'Nature',
            'NhaXinh',
            'Loreal',
          ].sort(() => Math.random() - 0.5)[0],
          description: `${title} - sản phẩm chất lượng cao phù hợp sử dụng hàng ngày.`,
          status: 'ACTIVE',
          priceMin: String(price),
          priceMax: String(priceMax),
          ratingAvg: '0',
          reviewCount: 0,
          specsJson: { source: 'seeder' },
        });
        products.push(await this.products.save(product));
      }
    }

    for (const product of products) {
      const variantCount = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < variantCount; i += 1) {
        await this.variants.save(
          this.variants.create({
            product: { id: product.id } as Product,
            sku: `${product.slug.slice(0, 10).toUpperCase()}-${i + 1}`,
            title: `Phiên bản ${i + 1}`,
            price: product.priceMin,
            stockQuantity: 10 + Math.floor(Math.random() * 90),
            status: 'ACTIVE',
            specsJson: {},
          }),
        );
      }
    }

    this.logger.log(
      `Seeded ${categories.size} categories, ${sellerEntities.length} sellers, ${products.length} products`,
    );
  }

  private async seedReviewsAndBuyers(): Promise<void> {
    const allProducts = await this.products.find();
    if (allProducts.length === 0) return;

    const buyers: Buyer[] = [];
    for (let i = 0; i < 30; i += 1) {
      buyers.push(
        await this.buyers.save(
          this.buyers.create({
            email: `buyer${i + 1}@example.com`,
            displayName: `Người mua ${i + 1}`,
            phone: `090${String(1000000 + Math.floor(Math.random() * 8999999))}`,
            status: 'ACTIVE',
            userId: null,
            metadataJson: {},
          }),
        ),
      );
    }

    const reviewCount = Math.floor(allProducts.length * 3.5);
    for (let i = 0; i < reviewCount; i += 1) {
      const product =
        allProducts[Math.floor(Math.random() * allProducts.length)];
      const template =
        REVIEW_TEMPLATES[Math.floor(Math.random() * REVIEW_TEMPLATES.length)];
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      await this.reviews.save(
        this.reviews.create({
          productId: product.id,
          buyerId: buyer.id,
          sellerId: product.sellerId,
          rating: template.rating,
          title: template.title,
          content: template.content,
          status: 'APPROVED',
          sourceType: 'seeder',
          sourceReviewId: null,
        }),
      );
    }

    await this.recomputeProductStats(allProducts);
    this.logger.log(`Seeded ${buyers.length} buyers, ${reviewCount} reviews`);
  }

  private async recomputeProductStats(products: Product[]): Promise<void> {
    for (const product of products) {
      const stats = (await this.dataSource.query(
        `SELECT COUNT(*)::int AS review_count, COALESCE(AVG(rating), 0) AS avg_rating
         FROM marketplace.reviews
         WHERE product_id = $1 AND status = 'APPROVED'`,
        [product.id],
      )) as unknown as Array<{
        review_count: number;
        avg_rating: string | number;
      }>;
      const row = stats[0];
      await this.products.update(product.id, {
        reviewCount: row.review_count,
        ratingAvg: String(Number(row.avg_rating).toFixed(2)),
      });
    }
  }
}
