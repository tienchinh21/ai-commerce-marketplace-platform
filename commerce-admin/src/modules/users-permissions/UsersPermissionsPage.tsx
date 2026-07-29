import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function UsersPermissionsPage() {
  return (
    <>
      <DataPageHeader title="Users & Permissions" description="Quản lý admin users và permission-based access." />
      <Empty description="Users and permissions API chưa được kết nối." />
    </>
  );
}
