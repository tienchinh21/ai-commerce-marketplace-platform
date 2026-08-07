import { Card, Table, Tag, Button, Space, Progress, Statistic, Row, Col } from 'antd';
import { CloudUploadOutlined, SyncOutlined, DatabaseOutlined, FileTextOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';

const mockSources = [
  { id: 'src-1', name: 'Shopee Synthetic Import Feed', type: 'manual_import', lastSync: '2026-07-29 14:30', records: 120, status: 'COMPLETED' },
  { id: 'src-2', name: 'Lazada Product API Feed', type: 'api', lastSync: '2026-07-29 10:15', records: 450, status: 'COMPLETED' },
  { id: 'src-3', name: 'Tiki Review Dataset CSV', type: 'dataset', lastSync: '2026-07-28 18:00', records: 1250, status: 'COMPLETED' },
];

export function IngestionPage() {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Quản Lý Nguồn Dữ Liệu & Tải Snapshots (Data Ingestion)"
        description="Source Registry, quản lý nạp dữ liệu thô (Raw Snapshots), các đợt đồng bộ (Sync Runs) và map sang dữ liệu chuẩn hóa."
        actions={
          <Button type="primary" icon={<CloudUploadOutlined />} style={{ background: '#4f46e5' }}>
            Import File CSV/JSON Mới
          </Button>
        }
      />

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Tổng đợt Sync Runs" value={24} prefix={<SyncOutlined style={{ color: '#4f46e5' }} />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Raw Snapshots Đã Lưu" value={1820} prefix={<DatabaseOutlined style={{ color: '#16a34a' }} />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Dữ liệu chuẩn hóa (Canonical)" value={1280} prefix={<FileTextOutlined style={{ color: '#9333ea' }} />} />
          </Card>
        </Col>
      </Row>

      <Card title={<span style={{ fontWeight: 700 }}>Danh sách Nguồn Dữ Liệu (Data Sources)</span>} style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <Table
          dataSource={mockSources}
          rowKey="id"
          columns={[
            {
              title: 'Tên nguồn dữ liệu',
              dataIndex: 'name',
              render: (name) => (
                <Space>
                  <DatabaseOutlined style={{ color: '#6366f1' }} />
                  <span style={{ fontWeight: 600 }}>{name}</span>
                </Space>
              ),
            },
            { title: 'Loại nguồn', dataIndex: 'type', render: (type) => <Tag color="purple">{type}</Tag> },
            { title: 'Đợt Sync gần nhất', dataIndex: 'lastSync' },
            { title: 'Số bản ghi', dataIndex: 'records', render: (num) => <strong>{num} bản ghi</strong> },
            { title: 'Trạng thái', dataIndex: 'status', render: (status) => <StatusTag status={status} /> },
            {
              title: 'Thao tác',
              key: 'action',
              render: () => <Button size="small">Chạy Sync ngầm</Button>,
            },
          ]}
        />
      </Card>
    </Space>
  );
}
