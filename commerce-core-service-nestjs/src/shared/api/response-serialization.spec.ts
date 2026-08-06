import { Expose } from 'class-transformer';
import {
  toPaginatedResponseDto,
  toResponseDto,
  toResponseDtoList,
} from './response-serialization';
import {
  createBulkCreated,
  createCreated,
  createSuccess,
} from './mutation-response.dto';

class TestUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;
}

describe('response serialization helpers', () => {
  it('removes fields that are not exposed on the response DTO', () => {
    const result = toResponseDto(TestUserDto, {
      id: 'user-1',
      email: 'admin@example.com',
      passwordHash: 'secret-hash',
    });

    expect(result).toEqual({ id: 'user-1', email: 'admin@example.com' });
    expect('passwordHash' in result).toBe(false);
  });

  it('maps arrays with the same field filtering', () => {
    const result = toResponseDtoList(TestUserDto, [
      { id: 'user-1', email: 'a@example.com', passwordHash: 'x' },
      { id: 'user-2', email: 'b@example.com', passwordHash: 'y' },
    ]);

    expect(result).toEqual([
      { id: 'user-1', email: 'a@example.com' },
      { id: 'user-2', email: 'b@example.com' },
    ]);
  });

  it('maps paginated response items without changing pagination metadata', () => {
    const result = toPaginatedResponseDto(TestUserDto, {
      items: [{ id: 'user-1', email: 'a@example.com', passwordHash: 'x' }],
      total: 1,
      page: 2,
      pageSize: 20,
    });

    expect(result).toEqual({
      items: [{ id: 'user-1', email: 'a@example.com' }],
      total: 1,
      page: 2,
      pageSize: 20,
    });
  });

  it('builds standard mutation acknowledgements', () => {
    expect(createSuccess('Updated successfully')).toEqual({
      success: true,
      message: 'Updated successfully',
    });
    expect(createCreated('resource-1', 'Created successfully')).toEqual({
      success: true,
      id: 'resource-1',
      message: 'Created successfully',
    });
    expect(createBulkCreated(['a', 'b'], 'Images added successfully')).toEqual({
      success: true,
      ids: ['a', 'b'],
      count: 2,
      message: 'Images added successfully',
    });
  });
});
