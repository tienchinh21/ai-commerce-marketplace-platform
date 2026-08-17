import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class SemanticProductSearchFiltersDto {
  @ApiProperty({ required: false, example: 'Mỹ phẩm' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, example: 'Anessa' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ required: false, example: 100000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @ApiProperty({ required: false, example: 500000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @ApiProperty({ required: false, example: 4 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  ratingMin?: number;
}

export class SemanticProductSearchRequestDto {
  @ApiProperty({ example: 'kem chống nắng cho da dầu' })
  @IsString()
  @IsNotEmpty({ message: 'Query tìm kiếm không được để trống' })
  query: string;

  @ApiProperty({ required: false, type: () => SemanticProductSearchFiltersDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemanticProductSearchFiltersDto)
  filters?: SemanticProductSearchFiltersDto;

  @ApiProperty({ required: false, example: 10, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;
}

export class SemanticProductSearchItemDto {
  @ApiProperty({ example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' })
  productId: string;

  @ApiProperty({ example: 'Kem chống nắng Anessa Perfect UV Sunscreen' })
  title: string;

  @ApiProperty({ example: 'kem-chong-nang-anessa' })
  slug?: string;

  @ApiProperty({ example: 'Anessa', nullable: true })
  brand?: string | null;

  @ApiProperty({ example: 'Mỹ phẩm', nullable: true })
  category?: string | null;

  @ApiProperty({ example: 'Anessa Official', nullable: true })
  seller?: string | null;

  @ApiProperty({ example: 450000, nullable: true })
  priceMin?: number | null;

  @ApiProperty({ example: 650000, nullable: true })
  priceMax?: number | null;

  @ApiProperty({ example: 4.8, nullable: true })
  ratingAvg?: number | null;

  @ApiProperty({ example: 120, nullable: true })
  reviewCount?: number | null;

  @ApiProperty({ example: 0.8842 })
  score: number;

  @ApiProperty({ example: ['title', 'category'] })
  matchedFields: string[];

  @ApiProperty({ example: 'Sản phẩm có độ tương đồng 88% với tìm kiếm...' })
  explanation: string;
}

export class SemanticProductSearchResponseDto {
  @ApiProperty({ example: 'kem chống nắng cho da dầu' })
  query: string;

  @ApiProperty({ example: 'local-hash-embedding-v1' })
  provider: string;

  @ApiProperty({ type: [SemanticProductSearchItemDto] })
  items: SemanticProductSearchItemDto[];
}
