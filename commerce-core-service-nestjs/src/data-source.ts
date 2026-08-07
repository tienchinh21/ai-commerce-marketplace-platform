import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { loadEnv } from './shared/config/env';

// Load .env for TypeORM CLI (NestJS ConfigModule does this at runtime)
config();

// Entity imports — keep in sync with DatabaseModule
import { User } from './modules/auth/user.entity';
import { ExternalUser } from './modules/auth/external-user.entity';
import { Permission } from './modules/auth/permission.entity';
import { UserPermission } from './modules/auth/user-permission.entity';
import { Category } from './modules/categories/category.entity';
import { CategoryAttribute } from './modules/categories/category-attribute.entity';
import { Seller } from './modules/sellers/seller.entity';
import { Buyer } from './modules/buyers/buyer.entity';
import { Product } from './modules/products/product.entity';
import { ProductVariant } from './modules/products/product-variant.entity';
import { ProductImage } from './modules/products/product-image.entity';
import { Review } from './modules/reviews/review.entity';
import { Order } from './modules/orders/order.entity';
import { OrderItem } from './modules/orders/order-item.entity';
import { DataSourceEntity } from './modules/ingestion/data-source.entity';
import { SyncRun } from './modules/ingestion/sync-run.entity';
import { RawSnapshot } from './modules/ingestion/raw-snapshot.entity';
import { SourceProduct } from './modules/ingestion/source-product.entity';
import { SourceReview } from './modules/ingestion/source-review.entity';

const env = loadEnv();

const appDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  entities: [
    User,
    ExternalUser,
    Permission,
    UserPermission,
    Category,
    CategoryAttribute,
    Seller,
    Buyer,
    Product,
    ProductVariant,
    ProductImage,
    Review,
    Order,
    OrderItem,
    DataSourceEntity,
    SyncRun,
    RawSnapshot,
    SourceProduct,
    SourceReview,
  ],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: '_migrations',
  synchronize: false,
});

export default appDataSource;
