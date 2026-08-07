import { useEffect, useState } from 'react';

/**
 * Hook trì hoãn cập nhật giá trị (Debounce value hook)
 * Thường dùng cho các ô Input Search để tránh gọi API liên tục khi gõ phím.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
