import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AddImageDto {
  @ApiProperty({ example: 'https://example.com/images/product.jpg' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ example: 'Product image' })
  @IsOptional()
  @IsString()
  altText?: string;
}

export class AddImagesDto {
  @ApiProperty({
    type: () => [AddImageDto],
    example: [
      {
        url: 'https://example.com/images/product.jpg',
        sortOrder: 0,
        altText: 'Product image',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddImageDto)
  images: AddImageDto[];
}
