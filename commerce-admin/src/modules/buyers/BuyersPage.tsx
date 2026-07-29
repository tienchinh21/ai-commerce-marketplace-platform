import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function BuyersPage() {
  return (
    <>
      <DataPageHeader title="Buyers" description="Quản lý buyer/customer." />
      <Empty description="Buyers API chưa được kết nối." />
    </>
  );
}
