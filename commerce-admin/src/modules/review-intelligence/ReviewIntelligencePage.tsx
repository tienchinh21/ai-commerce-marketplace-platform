import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function ReviewIntelligencePage() {
  return (
    <>
      <DataPageHeader title="Review Intelligence" description="Sentiment, topics và product review summary." actions={null} />
      <Empty description="Review Intelligence API sẽ được nối sau khi AI Platform có skeleton." />
    </>
  );
}
