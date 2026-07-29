import { Table } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { DataPageHeader } from '../../shared/components/DataPageHeader';
import { StatusTag } from '../../shared/components/StatusTag';
import { fetchCategories } from './category.api';

export function CategoriesPage() {
  const query = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  return (
    <>
      <DataPageHeader title="Categories" description="Quản lý category tree và dynamic attributes." />
      <Table
        rowKey="id"
        loading={query.isLoading}
        dataSource={query.data ?? []}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Path', dataIndex: 'path' },
          { title: 'Level', dataIndex: 'level' },
          { title: 'Status', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
        ]}
      />
    </>
  );
}
