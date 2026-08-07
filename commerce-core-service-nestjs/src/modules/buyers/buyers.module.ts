import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './buyer.entity';
import { BuyersService } from './buyers.service';
import { CmsBuyersController } from './cms-buyers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Buyer])],
  controllers: [CmsBuyersController],
  providers: [BuyersService],
  exports: [BuyersService],
})
export class BuyersModule {}
