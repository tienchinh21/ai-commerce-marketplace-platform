import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function SellersPage() {
  return (
    <>
      <DataPageHeader title="Sellers" description="Quản lý seller trong marketplace." />
      <Empty description="Sellers API chưa được kết nối." />
    </>
  );
}
