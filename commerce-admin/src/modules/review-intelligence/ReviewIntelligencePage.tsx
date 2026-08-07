import { Alert, Card, Empty, Space } from 'antd';
import { DataPageHeader } from '@/shared/components/DataPageHeader';

export function ReviewIntelligencePage() {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Phân Tích Review AI (Review Intelligence & Sentiment Summaries)"
        description="Tự động phân tích Sentiment, trích xuất chủ đề khen/chê và tổng hợp điểm mạnh điểm yếu của từng sản phẩm."
        actions={null}
      />

      <Alert
        type="warning"
        showIcon
        message="Chưa có API Review Intelligence để kết nối"
        description="Page này đã bỏ dữ liệu phân tích giả. Khi AI service cung cấp endpoint sentiment/summary, thêm API wrapper thật rồi render dữ liệu từ response."
      />

      <Card title="Review Intelligence" style={{ borderRadius: 12 }}>
        <Empty description="Chưa có dữ liệu vì chưa kết nối API Review Intelligence." />
      </Card>
    </Space>
  );
}
