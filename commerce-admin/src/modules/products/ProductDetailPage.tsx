import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function ProductDetailPage() {
  return (
    <>
      <DataPageHeader title="Product Detail" description="Chi tiết product, variants, images, specs và reviews." />
      <Empty description="Product detail API chưa được kết nối." />
    </>
  );
}
