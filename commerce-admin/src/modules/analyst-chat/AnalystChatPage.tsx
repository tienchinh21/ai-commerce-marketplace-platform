import { Empty } from 'antd';
import { DataPageHeader } from '../../shared/components/DataPageHeader';

export function AnalystChatPage() {
  return (
    <>
      <DataPageHeader title="AI Analyst" description="Text-to-SQL analyst cho admin." actions={null} />
      <Empty description="AI Analyst API sẽ được nối sau khi AI Platform có skeleton." />
    </>
  );
}
