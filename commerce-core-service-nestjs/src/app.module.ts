import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/database.module';
import { AppController } from './app.controller';
import { loadEnv } from './shared/config/env';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { BuyersModule } from './modules/buyers/buyers.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { OrdersModule } from './modules/orders/orders.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { UsersPermissionsModule } from './modules/users-permissions/users-permissions.module';
import { SeederModule } from './shared/seeder/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadEnv],
    }),
    DatabaseModule,
    AuthModule,
    UsersPermissionsModule,
    CategoriesModule,
    SellersModule,
    BuyersModule,
    ProductsModule,
    ReviewsModule,
    OrdersModule,
    IngestionModule,
    AnalyticsModule,
    SeederModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
