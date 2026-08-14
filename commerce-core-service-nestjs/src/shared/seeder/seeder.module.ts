import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../modules/auth/user.entity';
import { ExternalUser } from '../../modules/auth/external-user.entity';
import { Permission } from '../../modules/auth/permission.entity';
import { UserPermission } from '../../modules/auth/user-permission.entity';
import { Category } from '../../modules/categories/category.entity';
import { Seller } from '../../modules/sellers/seller.entity';
import { Buyer } from '../../modules/buyers/buyer.entity';
import { Product } from '../../modules/products/product.entity';
import { ProductVariant } from '../../modules/products/product-variant.entity';
import { Review } from '../../modules/reviews/review.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ExternalUser,
      Permission,
      UserPermission,
      Category,
      Seller,
      Buyer,
      Product,
      ProductVariant,
      Review,
    ]),
  ],
  providers: [SeederService],
})
export class SeederModule implements OnApplicationBootstrap {
  constructor(
    private readonly seederService: SeederService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.get<string>('DB_SEED') !== 'false') {
      await this.seederService.seed();
    }
  }
}
