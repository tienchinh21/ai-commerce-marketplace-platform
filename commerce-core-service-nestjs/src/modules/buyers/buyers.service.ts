import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buyer } from './buyer.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

export interface ListBuyersQuery {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateBuyerInput {
  email: string;
  displayName: string;
  phone?: string | null;
  status?: string;
  userId?: string | null;
  metadataJson?: Record<string, unknown>;
}

export interface UpdateBuyerInput {
  email?: string;
  displayName?: string;
  phone?: string | null;
  status?: string;
  userId?: string | null;
  metadataJson?: Record<string, unknown>;
}

@Injectable()
export class BuyersService {
  constructor(
    @InjectRepository(Buyer) private readonly buyers: Repository<Buyer>,
  ) {}

  async list(query: ListBuyersQuery) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const qb = this.buyers.createQueryBuilder('buyer');

    if (query.search) {
      qb.andWhere(
        'buyer.displayName ILIKE :search OR buyer.email ILIKE :search',
        {
          search: `%${query.search}%`,
        },
      );
    }
    if (query.status) {
      qb.andWhere('buyer.status = :status', { status: query.status });
    }

    const [items, total] = await qb
      .leftJoinAndSelect('buyer.user', 'user')
      .orderBy('buyer.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { items, total, page, pageSize };
  }

  async get(id: string): Promise<Buyer> {
    const buyer = await this.buyers.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!buyer) {
      throw new NotFoundException({
        code: ApiErrorCode.BUYER_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.BUYER_NOT_FOUND],
      });
    }
    return buyer;
  }

  async create(input: CreateBuyerInput): Promise<Buyer> {
    const buyer = this.buyers.create({
      email: input.email.toLowerCase(),
      displayName: input.displayName,
      phone: input.phone ?? null,
      status: input.status ?? 'ACTIVE',
      userId: input.userId ?? null,
      metadataJson: input.metadataJson ?? {},
    });
    return this.buyers.save(buyer);
  }

  async update(id: string, input: UpdateBuyerInput): Promise<Buyer> {
    const buyer = await this.get(id);
    if (input.email !== undefined) buyer.email = input.email.toLowerCase();
    if (input.displayName !== undefined) buyer.displayName = input.displayName;
    if (input.phone !== undefined) buyer.phone = input.phone;
    if (input.status !== undefined) buyer.status = input.status;
    if (input.userId !== undefined) buyer.userId = input.userId;
    if (input.metadataJson !== undefined)
      buyer.metadataJson = input.metadataJson;
    return this.buyers.save(buyer);
  }
}
