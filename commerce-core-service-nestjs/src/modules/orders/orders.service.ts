import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

export interface CreateOrderInput {
  buyerId: string;
  sellerId: string;
  status?: string;
  paymentStatus?: string;
  currency?: string;
  orderedAt?: Date;
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
    unitPrice: number;
  }>;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
  ) {}

  async list(query: {
    buyerId?: string;
    sellerId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const qb = this.orders.createQueryBuilder('order');

    if (query.buyerId) {
      qb.andWhere('order.buyerId = :buyerId', { buyerId: query.buyerId });
    }
    if (query.sellerId) {
      qb.andWhere('order.sellerId = :sellerId', { sellerId: query.sellerId });
    }
    if (query.status) {
      qb.andWhere('order.status = :status', { status: query.status });
    }

    const [items, total] = await qb
      .orderBy('order.orderedAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { items, total, page, pageSize };
  }

  async get(id: string): Promise<Order> {
    const order = await this.orders.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async create(input: CreateOrderInput): Promise<Order> {
    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const order = this.orders.create({
      buyerId: input.buyerId,
      sellerId: input.sellerId,
      status: input.status ?? 'PENDING',
      paymentStatus: input.paymentStatus ?? 'UNPAID',
      totalAmount: String(totalAmount),
      currency: input.currency ?? 'VND',
      orderedAt: input.orderedAt ?? new Date(),
    });
    const saved = await this.orders.save(order);

    const items = input.items.map((item) =>
      this.orderItems.create({
        order: saved,
        productId: item.productId,
        variantId: item.variantId ?? null,
        quantity: item.quantity,
        unitPrice: String(item.unitPrice),
        totalPrice: String(item.quantity * item.unitPrice),
      }),
    );
    await this.orderItems.save(items);

    return this.get(saved.id);
  }
}
