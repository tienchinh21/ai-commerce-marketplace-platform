import React, { useEffect, useRef, useState } from 'react';
import { Table, TableProps } from 'antd';

export interface CoreTableProps<T extends object = Record<string, any>> extends TableProps<T> {
  /**
   * Style cho container bao bọc ngoài Table
   */
  containerStyle?: React.CSSProperties;
  /**
   * Chiều cao scroll Y tùy chỉnh. Nếu không truyền, CoreTable sẽ tự động tính toán
   * chiều cao còn lại của container cha để cuộn Y khớp 100% với màn hình.
   */
  scrollY?: number | string;
}

export function CoreTable<T extends object = Record<string, any>>({
  scroll,
  containerStyle,
  scrollY,
  pagination,
  style,
  ...restProps
}: CoreTableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [calcY, setCalcY] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (scrollY !== undefined) return;

    const updateHeight = () => {
      if (!containerRef.current) return;

      const containerEl = containerRef.current;
      const headerEl = containerEl.querySelector<HTMLElement>('.ant-table-header, .ant-table-thead');
      const paginationEl = containerEl.querySelector<HTMLElement>('.ant-table-pagination');

      const headerHeight = headerEl ? headerEl.offsetHeight : 45;
      const hasPagination = pagination !== false;
      const paginationHeight = hasPagination
        ? paginationEl
          ? paginationEl.offsetHeight + 24
          : 60
        : 0;
      const buffer = 16; // Khoảng đệm an toàn tránh làm tràn và cắt viền trên phân trang

      let availableBodyHeight: number;

      if (containerEl.clientHeight > 120) {
        availableBodyHeight = containerEl.clientHeight - headerHeight - paginationHeight - buffer;
      } else {
        const containerRect = containerEl.getBoundingClientRect();
        const availableBottomSpace = window.innerHeight - containerRect.top - 48;
        availableBodyHeight = availableBottomSpace - headerHeight - paginationHeight - buffer;
      }

      if (availableBodyHeight > 80) {
        setCalcY(availableBodyHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      resizeObserver.disconnect();
    };
  }, [scrollY, pagination]);

  const finalScrollY = scrollY !== undefined ? scrollY : calcY;

  const mergedScroll = {
    x: 'max-content',
    ...(finalScrollY ? { y: finalScrollY } : {}),
    ...scroll,
  };

  const mergedPagination =
    pagination !== false
      ? {
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} của ${total} bản ghi`,
          locale: {
            items_per_page: '/ trang',
            jump_to: 'Đến',
            jump_to_confirm: 'xác nhận',
            page: 'Trang',
            prev_page: 'Trang trước',
            next_page: 'Trang sau',
            prev_5: 'Về 5 trang trước',
            next_5: 'Đến 5 trang sau',
            page_size: 'Kích thước trang',
          },
          style: {
            margin: '16px 0 0 0',
            paddingTop: 4,
            ...((pagination && typeof pagination === 'object' && pagination.style) || {}),
          },
          ...pagination,
        }
      : false;

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        ...containerStyle,
      }}
    >
      <Table<T>
        scroll={mergedScroll}
        pagination={mergedPagination}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, ...style }}
        {...restProps}
      />
    </div>
  );
}
