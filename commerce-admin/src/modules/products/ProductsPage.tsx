import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function ProductsPage() {
  return (
    <>
      <DataPageHeader title="Products" description="Quản lý product catalog, variants, images và specs." />
      <Empty description="Products API chưa được kết nối." />
    </>
  );
}
