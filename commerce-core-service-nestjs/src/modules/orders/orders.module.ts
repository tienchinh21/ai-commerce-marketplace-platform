import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrdersService } from './orders.service';
import { CmsOrdersController } from './cms-orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [CmsOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
