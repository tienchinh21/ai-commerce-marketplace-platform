import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './seller.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

export interface ListSellersQuery {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateSellerInput {
  name: string;
  slug?: string;
  status?: string;
  userId?: string | null;
  metadataJson?: Record<string, unknown>;
}

export interface UpdateSellerInput {
  name?: string;
  slug?: string;
  status?: string;
  userId?: string | null;
  metadataJson?: Record<string, unknown>;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller) private readonly sellers: Repository<Seller>,
  ) {}

  async list(query: ListSellersQuery) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const qb = this.sellers.createQueryBuilder('seller');

    if (query.search) {
      qb.andWhere('seller.name ILIKE :search', { search: `%${query.search}%` });
    }
    if (query.status) {
      qb.andWhere('seller.status = :status', { status: query.status });
    }

    const [items, total] = await qb
      .leftJoinAndSelect('seller.user', 'user')
      .orderBy('seller.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { items, total, page, pageSize };
  }

  async get(id: string): Promise<Seller> {
    const seller = await this.sellers.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!seller) {
      throw new NotFoundException({
        code: ApiErrorCode.SELLER_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.SELLER_NOT_FOUND],
      });
    }
    return seller;
  }

  async create(input: CreateSellerInput): Promise<Seller> {
    const seller = this.sellers.create({
      name: input.name,
      slug: input.slug ?? slugify(input.name),
      status: input.status ?? 'ACTIVE',
      userId: input.userId ?? null,
      metadataJson: input.metadataJson ?? {},
    });
    return this.sellers.save(seller);
  }

  async update(id: string, input: UpdateSellerInput): Promise<Seller> {
    const seller = await this.get(id);
    if (input.name !== undefined) seller.name = input.name;
    if (input.slug !== undefined) seller.slug = input.slug;
    if (input.status !== undefined) seller.status = input.status;
    if (input.userId !== undefined) seller.userId = input.userId;
    if (input.metadataJson !== undefined)
      seller.metadataJson = input.metadataJson;
    return this.sellers.save(seller);
  }
}
