import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Card, Col, Row, Space, Statistic, Table, Tag } from 'antd';
import { CloudUploadOutlined, DatabaseOutlined, FileTextOutlined, SyncOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatDateTime, formatNumber } from '@/shared/utils/formatters';
import { fetchDataSources, fetchRawSnapshots, fetchSyncRuns } from './ingestion.api';
import type { DataSource } from './ingestion.types';

export function IngestionPage() {
  const dataSourcesQuery = useQuery({
    queryKey: ['cms-data-sources'],
    queryFn: fetchDataSources,
  });
  const syncRunsQuery = useQuery({
    queryKey: ['cms-sync-runs', 1, 20],
    queryFn: () => fetchSyncRuns({ page: 1, pageSize: 20 }),
  });
  const rawSnapshotsQuery = useQuery({
    queryKey: ['cms-raw-snapshots', 1, 20],
    queryFn: () => fetchRawSnapshots({ page: 1, pageSize: 20 }),
  });

  const latestSyncBySourceId = useMemo(() => {
    const map = new Map<string, string>();
    for (const syncRun of syncRunsQuery.data?.items ?? []) {
      const syncTime = syncRun.finishedAt ?? syncRun.startedAt ?? syncRun.createdAt;
      const currentTime = map.get(syncRun.dataSourceId);
      if (!currentTime || new Date(syncTime).getTime() > new Date(currentTime).getTime()) {
        map.set(syncRun.dataSourceId, syncTime);
      }
    }
    return map;
  }, [syncRunsQuery.data?.items]);

  const recordsBySourceId = useMemo(() => {
    const map = new Map<string, number>();
    for (const syncRun of syncRunsQuery.data?.items ?? []) {
      map.set(syncRun.dataSourceId, (map.get(syncRun.dataSourceId) ?? 0) + syncRun.totalRecords);
    }
    return map;
  }, [syncRunsQuery.data?.items]);

  const error = dataSourcesQuery.error ?? syncRunsQuery.error ?? rawSnapshotsQuery.error;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Quản Lý Nguồn Dữ Liệu & Tải Snapshots (Data Ingestion)"
        description="Source Registry, quản lý nạp dữ liệu thô (Raw Snapshots), các đợt đồng bộ (Sync Runs) và map sang dữ liệu chuẩn hóa."
        onRefresh={() => {
          dataSourcesQuery.refetch();
          syncRunsQuery.refetch();
          rawSnapshotsQuery.refetch();
        }}
        actions={
          <Button type="primary" icon={<CloudUploadOutlined />} style={{ background: '#4f46e5' }}>
            Import File CSV/JSON Mới
          </Button>
        }
      />

      {error && (
        <Alert type="error" showIcon message="Không tải được dữ liệu ingestion" description={extractErrorMessage(error)} />
      )}

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Tổng đợt Sync Runs"
              value={syncRunsQuery.data?.total ?? 0}
              prefix={<SyncOutlined style={{ color: '#4f46e5' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Raw Snapshots Đã Lưu"
              value={rawSnapshotsQuery.data?.total ?? 0}
              prefix={<DatabaseOutlined style={{ color: '#16a34a' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Bản ghi đã xử lý"
              value={formatNumber(syncRunsQuery.data?.items.reduce((sum, item) => sum + item.successCount, 0) ?? 0)}
              prefix={<FileTextOutlined style={{ color: '#9333ea' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card title={<span style={{ fontWeight: 700 }}>Danh sách Nguồn Dữ Liệu (Data Sources)</span>} style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <Table<DataSource>
          dataSource={dataSourcesQuery.data ?? []}
          rowKey="id"
          loading={dataSourcesQuery.isLoading || syncRunsQuery.isLoading}
          columns={[
            {
              title: 'Tên nguồn dữ liệu',
              dataIndex: 'name',
              render: (name: string) => (
                <Space>
                  <DatabaseOutlined style={{ color: '#6366f1' }} />
                  <span style={{ fontWeight: 600 }}>{name}</span>
                </Space>
              ),
            },
            { title: 'Loại nguồn', dataIndex: 'type', render: (type: string) => <Tag color="purple">{type}</Tag> },
            { title: 'Base URL', dataIndex: 'baseUrl', render: (baseUrl: string | null) => baseUrl || '-' },
            { title: 'Đợt Sync gần nhất', dataIndex: 'id', render: (id: string) => formatDateTime(latestSyncBySourceId.get(id)) },
            { title: 'Số bản ghi', dataIndex: 'id', render: (id: string) => <strong>{formatNumber(recordsBySourceId.get(id) ?? 0)} bản ghi</strong> },
            { title: 'Trạng thái', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
          ]}
        />
      </Card>
    </Space>
  );
}
