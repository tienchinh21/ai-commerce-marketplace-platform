/**
 * Định dạng số thành tiền tệ VND (Ví dụ: 1790000 -> 1.790.000 ₫)
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return '0 ₫';
  const numericValue = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  if (isNaN(numericValue)) return '0 ₫';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(numericValue);
}

/**
 * Định dạng số nguyên/thực có dấu phân cách hàng nghìn (Ví dụ: 12500 -> 12,500)
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '0';
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return '0';

  return new Intl.NumberFormat('vi-VN').format(numericValue);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Định dạng phần trăm (Ví dụ: 0.125 -> 12.5% hoặc 12.5 -> 12.5%)
 */
export function formatPercent(value: number | null | undefined, isDecimal = false): string {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  const val = isDecimal ? value * 100 : value;
  return `${val.toFixed(1)}%`;
}

/**
 * Rút gọn chuỗi dài kèm dấu ...
 */
export function truncateText(text: string | null | undefined, maxLength = 50): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
