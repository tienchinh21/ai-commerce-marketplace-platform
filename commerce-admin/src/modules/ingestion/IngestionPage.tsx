import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function IngestionPage() {
  return (
    <>
      <DataPageHeader title="Data Sources" description="Quản lý source registry, imports, sync runs và raw snapshots." />
      <Empty description="Ingestion APIs chưa được kết nối." />
    </>
  );
}
