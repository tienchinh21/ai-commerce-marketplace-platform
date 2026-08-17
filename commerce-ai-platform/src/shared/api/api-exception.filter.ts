import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorCode } from './api-error-code';
import { ApiErrorResponseDto } from './api-error-response.dto';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: ApiErrorCode | string = ApiErrorCode.INTERNAL_ERROR;
    let message = 'Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau.';
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const body = res as Record<string, unknown>;
        message = (body.message as string) ?? exception.message;
        if (Array.isArray(body.message)) {
          errors = body.message as string[];
          message = 'Dữ liệu đầu vào không hợp lệ.';
        }
        if (typeof body.errorCode === 'string') {
          errorCode = body.errorCode;
        } else if (status === HttpStatus.BAD_REQUEST) {
          errorCode = ApiErrorCode.VALIDATION_ERROR;
        } else if (status === HttpStatus.UNAUTHORIZED) {
          errorCode = ApiErrorCode.UNAUTHORIZED;
        } else if (status === HttpStatus.FORBIDDEN) {
          errorCode = ApiErrorCode.FORBIDDEN;
        } else if (status === HttpStatus.NOT_FOUND) {
          errorCode = ApiErrorCode.RESOURCE_NOT_FOUND;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const payload: ApiErrorResponseDto = {
      statusCode: status,
      errorCode,
      message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(payload);
  }
}
