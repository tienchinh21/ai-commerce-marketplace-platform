import { App } from 'antd';
import { useCallback } from 'react';
import { extractErrorMessage } from '@/shared/utils/error-handler';

/**
 * Hook tiện ích bọc quanh Ant Design App (Notification & Message)
 * Giúp hiển thị thông báo thành công hoặc lỗi chuẩn hóa toàn ứng dụng
 */
export function useNotification() {
  const { message, notification } = App.useApp();

  const success = useCallback(
    (msg: string) => {
      message.success(msg);
    },
    [message]
  );

  const error = useCallback(
    (err: unknown, title = 'Thao tác thất bại') => {
      const errorMsg = extractErrorMessage(err);
      notification.error({
        message: title,
        description: errorMsg,
        placement: 'topRight',
      });
    },
    [notification]
  );

  const info = useCallback(
    (msg: string) => {
      message.info(msg);
    },
    [message]
  );

  const warning = useCallback(
    (msg: string) => {
      message.warning(msg);
    },
    [message]
  );

  return {
    success,
    error,
    info,
    warning,
    rawMessage: message,
    rawNotification: notification,
  };
}
