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
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const headerEl = containerRef.current.querySelector<HTMLElement>('.ant-table-header, .ant-table-thead');
      const paginationEl = containerRef.current.querySelector<HTMLElement>('.ant-table-pagination');
      
      const headerHeight = headerEl ? headerEl.offsetHeight : 55;
      const paginationHeight = paginationEl ? paginationEl.offsetHeight + 32 : 64; // include margins
      
      // Calculate available space inside container for body rows
      // Account for card padding / boundaries bottom
      const windowHeight = window.innerHeight;
      const availableBottomSpace = windowHeight - containerRect.top - 24; // 24px bottom spacing
      const calculatedBodyHeight = availableBottomSpace - headerHeight - paginationHeight;
      
      if (calculatedBodyHeight > 100) {
        setCalcY(calculatedBodyHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    // ResizeObserver to detect parent card or container size changes
    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      resizeObserver.disconnect();
    };
  }, [scrollY]);

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
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} của ${total} bản ghi`,
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
        overflow: 'hidden',
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
