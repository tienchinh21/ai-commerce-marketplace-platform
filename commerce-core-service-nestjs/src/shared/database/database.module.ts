import { Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { loadEnv, type CoreEnv } from '../config/env';
import { Category } from '../../modules/categories/category.entity';
import { CategoryAttribute } from '../../modules/categories/category-attribute.entity';
import { Seller } from '../../modules/sellers/seller.entity';
import { Buyer } from '../../modules/buyers/buyer.entity';
import { Product } from '../../modules/products/product.entity';
import { ProductVariant } from '../../modules/products/product-variant.entity';
import { ProductImage } from '../../modules/products/product-image.entity';
import { Review } from '../../modules/reviews/review.entity';
import { Order } from '../../modules/orders/order.entity';
import { OrderItem } from '../../modules/orders/order-item.entity';
import { DataSourceEntity } from '../../modules/ingestion/data-source.entity';
import { SyncRun } from '../../modules/ingestion/sync-run.entity';
import { RawSnapshot } from '../../modules/ingestion/raw-snapshot.entity';
import { SourceProduct } from '../../modules/ingestion/source-product.entity';
import { SourceReview } from '../../modules/ingestion/source-review.entity';
import { User } from '../../modules/auth/user.entity';
import { ExternalUser } from '../../modules/auth/external-user.entity';
import { Permission } from '../../modules/auth/permission.entity';
import { UserPermission } from '../../modules/auth/user-permission.entity';

const entities = [
  User,
  ExternalUser,
  Permission,
  UserPermission,
  Seller,
  Buyer,
  Category,
  CategoryAttribute,
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
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const env: CoreEnv = config.get<CoreEnv>('coreEnv') ?? loadEnv();
        return {
          type: 'postgres',
          host: env.db.host,
          port: env.db.port,
          username: env.db.user,
          password: env.db.password,
          database: env.db.name,
          entities,
          synchronize: env.db.synchronize,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleDestroy(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}
