import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function ReviewsPage() {
  return (
    <>
      <DataPageHeader title="Reviews" description="Quản lý review gốc và moderation status." />
      <Empty description="Reviews API chưa được kết nối." />
    </>
  );
}
