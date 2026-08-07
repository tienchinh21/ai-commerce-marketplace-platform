import { Empty } from 'antd';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { ROUTES } from '@/shared/constants/routes.constants';

export function ProductDetailPage() {
  return (
    <>
      <DataPageHeader
        title="Chi Tiết Sản Phẩm"
        description="Chi tiết product, variants, images, specs và reviews."
        breadcrumbs={[
          { title: 'Trang chủ', path: ROUTES.DASHBOARD },
          { title: 'Sản phẩm', path: ROUTES.PRODUCTS },
          { title: 'Chi tiết sản phẩm' },
        ]}
      />
      <Empty description="Product detail API chưa được kết nối." />
    </>
  );
}
