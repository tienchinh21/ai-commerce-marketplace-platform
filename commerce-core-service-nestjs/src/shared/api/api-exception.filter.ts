import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorCode } from './api-error-code';
import { ApiErrorDetailDto, ApiErrorResponseDto } from './api-error-response.dto';
import { VI_API_MESSAGES } from './api-messages.vi';

interface CodedErrorBody {
  code?: ApiErrorCode | string;
  message?: string | string[];
  details?: ApiErrorDetailDto[];
}

interface NormalizedError {
  statusCode: number;
  code: ApiErrorCode | string;
  message: string;
  details?: ApiErrorDetailDto[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getPgErrorCode(exception: unknown): string | undefined {
  return isRecord(exception) && typeof exception.code === 'string'
    ? exception.code
    : undefined;
}

function normalizeHttpException(exception: HttpException): NormalizedError {
  const statusCode = exception.getStatus();
  const response = exception.getResponse();
  const body: CodedErrorBody = isRecord(response)
    ? (response as CodedErrorBody)
    : { message: String(response) };

  if (body.code && typeof body.message === 'string') {
    return {
      statusCode,
      code: body.code,
      message: body.message,
      details: body.details,
    };
  }

  if (exception instanceof UnauthorizedException) {
    return {
      statusCode,
      code: ApiErrorCode.AUTH_UNAUTHORIZED,
      message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_UNAUTHORIZED],
    };
  }

  if (exception instanceof ForbiddenException) {
    return {
      statusCode,
      code: ApiErrorCode.AUTH_FORBIDDEN,
      message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_FORBIDDEN],
    };
  }

  if (
    statusCode === HttpStatus.BAD_REQUEST &&
    typeof body.message === 'string' &&
    body.message.toLowerCase().includes('uuid')
  ) {
    return {
      statusCode,
      code: ApiErrorCode.INVALID_UUID,
      message: VI_API_MESSAGES.errors[ApiErrorCode.INVALID_UUID],
    };
  }

  if (statusCode === HttpStatus.CONFLICT) {
    return {
      statusCode,
      code: ApiErrorCode.DATABASE_CONFLICT,
      message: VI_API_MESSAGES.errors[ApiErrorCode.DATABASE_CONFLICT],
    };
  }

  return {
    statusCode,
    code: ApiErrorCode.INTERNAL_SERVER_ERROR,
    message:
      statusCode >= 500
        ? VI_API_MESSAGES.errors[ApiErrorCode.INTERNAL_SERVER_ERROR]
        : VI_API_MESSAGES.errors[ApiErrorCode.VALIDATION_FAILED],
  };
}

function normalizeDatabaseError(exception: unknown): NormalizedError | null {
  const pgCode = getPgErrorCode(exception);
  if (pgCode === '23505') {
    return {
      statusCode: HttpStatus.CONFLICT,
      code: ApiErrorCode.DATABASE_CONFLICT,
      message: VI_API_MESSAGES.errors[ApiErrorCode.DATABASE_CONFLICT],
    };
  }
  if (pgCode === '23503') {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      code: ApiErrorCode.DATABASE_RELATION_NOT_FOUND,
      message: VI_API_MESSAGES.errors[ApiErrorCode.DATABASE_RELATION_NOT_FOUND],
    };
  }
  if (pgCode === '23502') {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      code: ApiErrorCode.DATABASE_REQUIRED_FIELD_MISSING,
      message: VI_API_MESSAGES.errors[ApiErrorCode.DATABASE_REQUIRED_FIELD_MISSING],
    };
  }
  return null;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const normalized =
      exception instanceof HttpException
        ? normalizeHttpException(exception)
        : normalizeDatabaseError(exception) ?? {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            code: ApiErrorCode.INTERNAL_SERVER_ERROR,
            message: VI_API_MESSAGES.errors[ApiErrorCode.INTERNAL_SERVER_ERROR],
            details: undefined,
          };

    const payload: ApiErrorResponseDto = {
      success: false,
      statusCode: normalized.statusCode,
      code: normalized.code,
      message: normalized.message,
      details: normalized.details ?? [],
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    response.status(normalized.statusCode).json(payload);
  }
}
