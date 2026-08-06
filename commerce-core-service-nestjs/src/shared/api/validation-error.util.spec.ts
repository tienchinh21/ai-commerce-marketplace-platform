import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
  createVietnameseValidationException,
  flattenValidationErrors,
} from './validation-error.util';
import { ApiErrorCode } from './api-error-code';
import { VI_API_MESSAGES } from './api-messages.vi';

describe('Vietnamese validation errors', () => {
  it('maps common class-validator constraints to Vietnamese messages', () => {
    const errors: ValidationError[] = [
      {
        property: 'email',
        constraints: { isEmail: 'email must be an email' },
      },
      {
        property: 'password',
        constraints: {
          minLength: 'password must be longer than or equal to 8 characters',
        },
      },
      {
        property: 'items',
        children: [
          {
            property: '0',
            children: [
              {
                property: 'productId',
                constraints: { isUuid: 'productId must be a UUID' },
              },
            ],
          },
        ],
      },
    ];

    expect(flattenValidationErrors(errors)).toEqual([
      { field: 'email', message: 'Email không hợp lệ.' },
      {
        field: 'password',
        message: 'Mật khẩu không hợp lệ hoặc chưa đủ độ dài.',
      },
      { field: 'items.0.productId', message: 'Mã định danh không hợp lệ.' },
    ]);
  });

  it('creates a BadRequestException with normalized Vietnamese payload', () => {
    const exception = createVietnameseValidationException([
      {
        property: 'title',
        constraints: { isNotEmpty: 'title should not be empty' },
      },
    ]);

    expect(exception).toBeInstanceOf(BadRequestException);
    expect(exception.getResponse()).toEqual({
      code: ApiErrorCode.VALIDATION_FAILED,
      message: VI_API_MESSAGES.errors[ApiErrorCode.VALIDATION_FAILED],
      details: [{ field: 'title', message: 'Trường này không được để trống.' }],
    });
  });
});
