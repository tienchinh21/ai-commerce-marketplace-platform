import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { Seller } from '../sellers/seller.entity';
import { Category } from '../categories/category.entity';
import { ProductsService } from './products.service';
import { CmsProductsController } from './cms-products.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductImage,
      Seller,
      Category,
    ]),
  ],
  controllers: [CmsProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
