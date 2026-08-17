import { Injectable } from '@nestjs/common';
import { SqlSafetyResult, SqlSafetyStatus } from './sql-safety.types';

const BLOCKED_KEYWORDS = [
  'insert',
  'update',
  'delete',
  'drop',
  'alter',
  'truncate',
  'create',
  'grant',
  'revoke',
  'execute',
  'pg_sleep',
  'copy',
];

const ALLOWED_TABLES = [
  'analytics.product_performance',
  'analytics.review_sentiment',
  'analytics.seller_performance',
  'analytics.category_summary',
  'marketplace.products',
  'marketplace.reviews',
  'marketplace.categories',
  'marketplace.sellers',
  'marketplace.orders',
];

@Injectable()
export class SqlSafetyService {
  validate(sql: string): SqlSafetyResult {
    const trimmed = (sql ?? '').trim();
    if (!trimmed) {
      return {
        allowed: false,
        status: 'EMPTY_SQL',
        reasons: ['Câu lệnh SQL trống.'],
      };
    }

    const normalized = trimmed.replace(/\s+/g, ' ');
    const lower = normalized.toLowerCase();

    // Check blocked keywords first
    for (const keyword of BLOCKED_KEYWORDS) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lower)) {
        return {
          allowed: false,
          status: 'BLOCKED_MUTATION',
          reasons: [`Phát hiện từ khóa không an toàn: ${keyword.toUpperCase()}`],
        };
      }
    }

    // Check starts with SELECT
    if (!lower.startsWith('select ')) {
      return {
        allowed: false,
        status: 'NOT_SELECT',
        reasons: ['Chỉ chấp nhận các truy vấn bắt đầu bằng SELECT.'],
      };
    }

    // Check allowed tables
    const hasAllowedTable = ALLOWED_TABLES.some((table) => {
      const tableName = table.split('.')[1];
      return lower.includes(table) || lower.includes(tableName);
    });

    if (!hasAllowedTable) {
      return {
        allowed: false,
        status: 'UNSAFE_TABLE',
        reasons: [
          `Truy vấn phải nhắm vào các bảng/view được cấp phép (${ALLOWED_TABLES.join(', ')}).`,
        ],
      };
    }

    // Check LIMIT
    if (!/\blimit\s+\d+\b/i.test(lower)) {
      return {
        allowed: false,
        status: 'MISSING_LIMIT',
        reasons: ['Truy vấn bắt buộc phải có mệnh đề LIMIT để giới hạn số dòng kết quả.'],
      };
    }

    return {
      allowed: true,
      status: 'ALLOWED',
      reasons: [],
      normalizedSql: normalized,
    };
  }
}
