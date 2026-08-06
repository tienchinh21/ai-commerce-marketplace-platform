import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ApiErrorDetailDto } from './api-error-response.dto';
import { ApiErrorCode } from './api-error-code';
import { VI_API_MESSAGES } from './api-messages.vi';

const CONSTRAINT_MESSAGES: Record<string, string> = {
  isEmail: 'Email không hợp lệ.',
  isUuid: 'Mã định danh không hợp lệ.',
  isUUID: 'Mã định danh không hợp lệ.',
  isNotEmpty: 'Trường này không được để trống.',
  isString: 'Giá trị phải là chuỗi.',
  isNumber: 'Giá trị phải là số.',
  isInt: 'Giá trị phải là số nguyên.',
  isBoolean: 'Giá trị phải là đúng hoặc sai.',
  isArray: 'Giá trị phải là danh sách.',
  arrayMinSize: 'Danh sách phải có ít nhất một phần tử.',
  min: 'Giá trị nhỏ hơn mức tối thiểu cho phép.',
  max: 'Giá trị vượt quá mức tối đa cho phép.',
  minLength: 'Mật khẩu không hợp lệ hoặc chưa đủ độ dài.',
  maxLength: 'Giá trị vượt quá độ dài cho phép.',
  isOptional: 'Giá trị không hợp lệ.',
};

function messageForConstraint(name: string): string {
  return CONSTRAINT_MESSAGES[name] ?? 'Giá trị không hợp lệ.';
}

function walkValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ApiErrorDetailDto[] {
  return errors.flatMap((error) => {
    const field = parentPath ? `${parentPath}.${error.property}` : error.property;
    const ownErrors = Object.keys(error.constraints ?? {}).map((constraint) => ({
      field,
      message: messageForConstraint(constraint),
    }));
    const childErrors = error.children?.length
      ? walkValidationErrors(error.children, field)
      : [];
    return [...ownErrors, ...childErrors];
  });
}

export function flattenValidationErrors(
  errors: ValidationError[],
): ApiErrorDetailDto[] {
  return walkValidationErrors(errors);
}

export function createVietnameseValidationException(
  errors: ValidationError[],
): BadRequestException {
  return new BadRequestException({
    code: ApiErrorCode.VALIDATION_FAILED,
    message: VI_API_MESSAGES.errors[ApiErrorCode.VALIDATION_FAILED],
    details: flattenValidationErrors(errors),
  });
}
