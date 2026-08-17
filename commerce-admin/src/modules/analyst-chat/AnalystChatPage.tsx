import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  CodeOutlined,
  DatabaseOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { askAnalyst } from './analyst-chat.api';
import type { AnalystChatResponse } from './analyst-chat.types';

const { Paragraph, Text, Title } = Typography;

const SUGGESTIONS = [
  'Top 10 sản phẩm doanh thu cao nhất',
  'Thống kê review & sentiment sản phẩm',
  'Hiệu suất người bán (seller performance)',
  'Tổng hợp theo danh mục sản phẩm',
];

export function AnalystChatPage() {
  const [prompt, setPrompt] = useState('');

  const chatMutation = useMutation<AnalystChatResponse, Error, string>({
    mutationFn: (question) => askAnalyst({ question }),
  });

  const handleSend = (textToSend?: string) => {
    const q = (textToSend ?? prompt).trim();
    if (!q) return;
    if (textToSend) setPrompt(textToSend);
    chatMutation.mutate(q);
  };

  const response = chatMutation.data;
  const columns =
    response?.columns.map((col) => ({
      title: col,
      dataIndex: col,
      key: col,
      render: (val: unknown) => {
        if (typeof val === 'number') {
          return val.toLocaleString('vi-VN');
        }
        return String(val ?? '-');
      },
    })) ?? [];

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Trợ Lý Báo Cáo AI (Text-to-SQL Analyst)"
        description="Hỏi đáp dữ liệu báo cáo bằng tiếng Việt tự nhiên. AI sinh truy vấn SQL an toàn (Chỉ SELECT) và trả về bảng + biểu đồ trực quan."
        actions={null}
      />

      {chatMutation.isError && (
        <Alert
          type="error"
          showIcon
          message="Không thể kết nối đến AI Analyst"
          description={chatMutation.error?.message || 'Vui lòng kiểm tra dịch vụ commerce-ai-platform đang chạy.'}
        />
      )}

      <Card style={{ borderRadius: 16 }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Alert
            message="Chế độ SQL Guardrail Bảo Mật: chỉ cho phép câu lệnh SELECT read-only trên database views analytics kèm mệnh đề LIMIT."
            type="info"
            showIcon
            icon={<SafetyCertificateOutlined style={{ color: '#4f46e5' }} />}
            style={{ borderRadius: 8 }}
          />

          <Space wrap align="center">
            <Text type="secondary" style={{ fontSize: 13 }}>
              <QuestionCircleOutlined /> Gợi ý câu hỏi nhanh:
            </Text>
            {SUGGESTIONS.map((suggestion) => (
              <Button
                key={suggestion}
                size="small"
                style={{ borderRadius: 20, fontSize: 12 }}
                onClick={() => handleSend(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </Space>

          <div style={{ display: 'flex', gap: 12 }}>
            <Input.TextArea
              rows={2}
              placeholder="Nhập câu hỏi báo cáo dữ liệu của bạn bằng tiếng Việt..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              style={{ borderRadius: 10, fontSize: 14 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={chatMutation.isPending}
              disabled={!prompt.trim()}
              onClick={() => handleSend()}
              style={{ height: 'auto', padding: '0 24px', borderRadius: 10, fontWeight: 600 }}
            >
              Gửi câu hỏi
            </Button>
          </div>
        </Space>
      </Card>

      <Card
        title={
          <Space>
            <span>Phản hồi từ AI Analyst</span>
            {response?.safetyStatus && (
              <Tag
                color={
                  response.safetyStatus === 'ALLOWED'
                    ? 'success'
                    : response.safetyStatus === 'NOT_GENERATED'
                    ? 'default'
                    : 'error'
                }
                icon={<SafetyCertificateOutlined />}
              >
                Guardrail: {response.safetyStatus}
              </Tag>
            )}
            {response?.executionStatus && (
              <Tag
                color={
                  response.executionStatus === 'SUCCESS'
                    ? 'blue'
                    : response.executionStatus === 'FAILED'
                    ? 'red'
                    : 'default'
                }
                icon={<DatabaseOutlined />}
              >
                Execution: {response.executionStatus}
              </Tag>
            )}
          </Space>
        }
        style={{ borderRadius: 12 }}
      >
        {chatMutation.isPending ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="AI đang phân tích câu hỏi và kiểm tra tính an toàn SQL..." />
          </div>
        ) : response ? (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Alert
              message={response.answer}
              type={response.executionStatus === 'SUCCESS' ? 'success' : 'info'}
              showIcon
              style={{ borderRadius: 8 }}
            />

            {response.generatedSql && (
              <Card
                size="small"
                title={
                  <Space>
                    <CodeOutlined />
                    <span>SQL được sinh bởi AI (Read-Only)</span>
                  </Space>
                }
                style={{ background: '#f8fafc', borderRadius: 8 }}
              >
                <Paragraph
                  code
                  copyable
                  style={{ margin: 0, fontSize: 13, color: '#1e293b' }}
                >
                  {response.generatedSql}
                </Paragraph>
              </Card>
            )}

            {response.rows && response.rows.length > 0 ? (
              <div>
                <Title level={5} style={{ marginBottom: 12 }}>
                  Dữ liệu kết quả ({response.rows.length} dòng)
                </Title>
                <Table
                  dataSource={response.rows}
                  columns={columns}
                  rowKey={(_, idx) => String(idx)}
                  pagination={{ pageSize: 5 }}
                  bordered
                  size="small"
                />
              </div>
            ) : null}
          </Space>
        ) : (
          <Empty description="Nhập câu hỏi ở trên để bắt đầu trò chuyện với AI Analyst." />
        )}
      </Card>
    </Space>
  );
}
