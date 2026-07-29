import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function AiSearchPage() {
  return (
    <>
      <DataPageHeader title="AI Search" description="Semantic product search với filters, score và explanation." actions={null} />
      <Empty description="AI Search API sẽ được nối sau khi AI Platform có skeleton." />
    </>
  );
}
