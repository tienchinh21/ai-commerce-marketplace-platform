import { ClassConstructor, plainToInstance } from 'class-transformer';

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function toResponseDto<T, V>(
  dtoClass: ClassConstructor<T>,
  value: V,
): T {
  return plainToInstance(dtoClass, value, {
    excludeExtraneousValues: true,
  });
}

export function toResponseDtoList<T, V>(
  dtoClass: ClassConstructor<T>,
  values: V[],
): T[] {
  return values.map((value) => toResponseDto(dtoClass, value));
}

export function toPaginatedResponseDto<T, V>(
  dtoClass: ClassConstructor<T>,
  page: PageResult<V>,
): PageResult<T> {
  return {
    items: toResponseDtoList(dtoClass, page.items),
    total: page.total,
    page: page.page,
    pageSize: page.pageSize,
  };
}
