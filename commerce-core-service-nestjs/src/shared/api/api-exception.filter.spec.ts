import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { ApiExceptionFilter } from './api-exception.filter';
import { ApiErrorCode } from './api-error-code';
import { VI_API_MESSAGES } from './api-messages.vi';

function createHost() {
  const json = jest.fn<unknown, [unknown]>();
  const status = jest.fn().mockReturnValue({ json });
  const response = { status };
  const request = { url: '/api/cms/products/id', method: 'GET' };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as ArgumentsHost;
  return { host, status, json };
}

describe('ApiExceptionFilter', () => {
  it('keeps Vietnamese coded HttpException payloads', () => {
    const { host, status, json } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(
      new NotFoundException({
        code: ApiErrorCode.PRODUCT_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.PRODUCT_NOT_FOUND],
      }),
      host,
    );

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: 404,
        code: ApiErrorCode.PRODUCT_NOT_FOUND,
        message: 'Không tìm thấy sản phẩm.',
        path: '/api/cms/products/id',
        method: 'GET',
      }),
    );
  });

  it('maps uncoded UnauthorizedException to Vietnamese auth message', () => {
    const { host, json } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(new UnauthorizedException(), host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        code: ApiErrorCode.AUTH_UNAUTHORIZED,
        message: 'Bạn cần đăng nhập để thực hiện thao tác này.',
      }),
    );
  });

  it('maps uncoded ForbiddenException to Vietnamese permission message', () => {
    const { host, json } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(new ForbiddenException(), host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        code: ApiErrorCode.AUTH_FORBIDDEN,
        message: 'Bạn không có quyền thực hiện thao tác này.',
      }),
    );
  });

  it('maps ParseUUIDPipe bad request errors to Vietnamese UUID message', () => {
    const { host, json } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(
      new BadRequestException('Validation failed (uuid is expected)'),
      host,
    );

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        code: ApiErrorCode.INVALID_UUID,
        message: 'Mã định danh không hợp lệ.',
      }),
    );
  });

  it('maps Postgres unique constraint errors to Vietnamese conflict message', () => {
    const { host, json } = createHost();
    const filter = new ApiExceptionFilter();
    const error = { code: '23505' };

    filter.catch(error, host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: ApiErrorCode.DATABASE_CONFLICT,
        message: 'Dữ liệu đã tồn tại hoặc bị trùng.',
      }),
    );
  });

  it('hides unexpected error details behind a Vietnamese system message', () => {
    const { host, json } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(new Error('database password leaked'), host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
      }),
    );
    expect(JSON.stringify(json.mock.calls[0][0])).not.toContain(
      'database password leaked',
    );
  });
});
