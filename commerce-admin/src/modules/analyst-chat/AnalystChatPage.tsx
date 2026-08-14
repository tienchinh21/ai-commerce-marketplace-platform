import { useState } from 'react';
import { Alert, Button, Card, Empty, Input, Space } from 'antd';
import { SafetyCertificateOutlined, SendOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';

export function AnalystChatPage() {
  const [prompt, setPrompt] = useState('');

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Trợ Lý Báo Cáo AI (Text-to-SQL Analyst)"
        description="Hỏi đáp dữ liệu báo cáo bằng tiếng Việt tự nhiên. AI sinh truy vấn SQL an toàn (Chỉ SELECT) và trả về bảng + biểu đồ trực quan."
        actions={null}
      />

      <Alert
        message="Chưa có API Text-to-SQL Analyst để kết nối"
        description="Page này không còn hiển thị kết quả giả. Khi AI service có endpoint, nối query thật và render bảng từ response."
        type="warning"
        showIcon
      />

      <Card style={{ borderRadius: 16 }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Alert
            message="Chế độ SQL Guardrail Bảo Mật: chỉ cho phép câu lệnh SELECT read-only trên database views analytics."
            type="info"
            showIcon
            icon={<SafetyCertificateOutlined style={{ color: '#4f46e5' }} />}
            style={{ borderRadius: 8 }}
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <Input.TextArea
              rows={2}
              placeholder="Nhập câu hỏi báo cáo dữ liệu của bạn bằng tiếng Việt..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              style={{ borderRadius: 10, fontSize: 14 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              disabled
              style={{ height: 'auto', padding: '0 24px', borderRadius: 10, background: '#4f46e5', fontWeight: 600 }}
            >
              Gửi câu hỏi
            </Button>
          </div>
        </Space>
      </Card>

      <Card title="Phản hồi từ AI Analyst" style={{ borderRadius: 12 }}>
        <Empty description="Chưa có dữ liệu vì chưa kết nối API Analyst." />
      </Card>
    </Space>
  );
}
