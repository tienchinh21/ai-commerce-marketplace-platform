import { isAxiosError } from 'axios';

/**
 * Interface cho API Error Response chuẩn từ NestJS / Core Service
 */
export interface ApiErrorResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  path?: string;
  timestamp?: string;
}

/**
 * Trích xuất chuỗi thông báo lỗi đọc được cho người dùng từ bất kỳ loại lỗi nào (Axios, Error, String, ...)
 */
export function extractErrorMessage(error: unknown, fallbackMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.'): string {
  if (!error) return fallbackMessage;

  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message.join(', ');
      }
      return data.message;
    }

    if (error.response?.status === 401) {
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    }
    if (error.response?.status === 403) {
      return 'Bạn không có quyền thực hiện thao tác này.';
    }
    if (error.response?.status === 404) {
      return 'Không tìm thấy dữ liệu yêu cầu.';
    }
    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallbackMessage;
}
