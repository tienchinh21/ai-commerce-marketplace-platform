import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './seller.entity';
import { SellersService } from './sellers.service';
import { CmsSellersController } from './cms-sellers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Seller])],
  controllers: [CmsSellersController],
  providers: [SellersService],
  exports: [SellersService],
})
export class SellersModule {}
