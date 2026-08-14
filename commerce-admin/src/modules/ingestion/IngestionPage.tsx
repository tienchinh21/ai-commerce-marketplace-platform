import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Card, Descriptions, Drawer, Form, Input, Modal, Row, Col, Select, Space, Statistic, Tabs, Tag } from 'antd';
import { CloudUploadOutlined, DatabaseOutlined, EditOutlined, EyeOutlined, FileTextOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { CoreTable } from '@/shared/components/CoreTable';
import { useModalState, useNotification } from '@/shared/hooks';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { formatDateTime, formatNumber } from '@/shared/utils/formatters';
import { parseJsonObject, stringifyJsonObject } from '@/shared/utils/json-object';
import {
  createDataSource,
  fetchDataSourceDetail,
  fetchDataSources,
  fetchRawSnapshotDetail,
  fetchRawSnapshots,
  fetchSyncRunDetail,
  fetchSyncRuns,
  importProducts,
  importReviews,
  updateDataSource,
} from './ingestion.api';
import type { DataSource, DataSourcePayload, ImportProductItem, ImportReviewItem, RawSnapshot, SyncRun } from './ingestion.types';

interface DataSourceFormValues extends Omit<DataSourcePayload, 'configJson'> {
  configJsonText?: string;
}

interface ImportFormValues {
  kind: 'products' | 'reviews';
  dataSourceId: string;
  itemsText: string;
}

const statusOptions = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'INACTIVE', label: 'INACTIVE' },
];

function parseImportItems<T>(input: string): T[] {
  const value = JSON.parse(input) as unknown;
  if (!Array.isArray(value)) {
    throw new Error('Danh sách import phải là JSON array.');
  }
  return value as T[];
}

export function IngestionPage() {
  const notify = useNotification();
  const queryClient = useQueryClient();
  const [sourceForm] = Form.useForm<DataSourceFormValues>();
  const [importForm] = Form.useForm<ImportFormValues>();
  const sourceModal = useModalState<DataSource>();
  const importModal = useModalState();
  const sourceDrawer = useModalState<DataSource>();
  const syncDrawer = useModalState<SyncRun>();
  const snapshotDrawer = useModalState<RawSnapshot>();

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

  const dataSourceDetailQuery = useQuery({
    queryKey: ['cms-data-source-detail', sourceDrawer.data?.id],
    queryFn: () => fetchDataSourceDetail(sourceDrawer.data?.id as string),
    enabled: sourceDrawer.open && Boolean(sourceDrawer.data?.id),
  });
  const syncRunDetailQuery = useQuery({
    queryKey: ['cms-sync-run-detail', syncDrawer.data?.id],
    queryFn: () => fetchSyncRunDetail(syncDrawer.data?.id as string),
    enabled: syncDrawer.open && Boolean(syncDrawer.data?.id),
  });
  const snapshotDetailQuery = useQuery({
    queryKey: ['cms-raw-snapshot-detail', snapshotDrawer.data?.id],
    queryFn: () => fetchRawSnapshotDetail(snapshotDrawer.data?.id as string),
    enabled: snapshotDrawer.open && Boolean(snapshotDrawer.data?.id),
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

  const sourceOptions = dataSourcesQuery.data?.map((source) => ({ value: source.id, label: source.name })) ?? [];
  const sourceNameById = useMemo(
    () => new Map((dataSourcesQuery.data ?? []).map((source) => [source.id, source.name])),
    [dataSourcesQuery.data],
  );

  const refreshAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['cms-data-sources'] }),
      queryClient.invalidateQueries({ queryKey: ['cms-sync-runs'] }),
      queryClient.invalidateQueries({ queryKey: ['cms-raw-snapshots'] }),
    ]);
  };

  const createSourceMutation = useMutation({
    mutationFn: createDataSource,
    onSuccess: async () => {
      notify.success('Đã tạo nguồn dữ liệu.');
      sourceForm.resetFields();
      sourceModal.hideModal();
      await refreshAll();
    },
    onError: (error) => notify.error(error, 'Tạo nguồn dữ liệu thất bại.'),
  });

  const updateSourceMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DataSourcePayload }) => updateDataSource(id, payload),
    onSuccess: async () => {
      notify.success('Đã cập nhật nguồn dữ liệu.');
      sourceForm.resetFields();
      sourceModal.hideModal();
      await refreshAll();
    },
    onError: (error) => notify.error(error, 'Cập nhật nguồn dữ liệu thất bại.'),
  });

  const importMutation = useMutation({
    mutationFn: (values: ImportFormValues) => {
      if (values.kind === 'products') {
        return importProducts({
          dataSourceId: values.dataSourceId,
          items: parseImportItems<ImportProductItem>(values.itemsText),
        });
      }
      return importReviews({
        dataSourceId: values.dataSourceId,
        items: parseImportItems<ImportReviewItem>(values.itemsText),
      });
    },
    onSuccess: async (result) => {
      notify.success(result.message);
      importForm.resetFields();
      importModal.hideModal();
      await refreshAll();
    },
    onError: (error) => notify.error(error, 'Import dữ liệu thất bại.'),
  });

  function openCreateSourceModal() {
    sourceForm.resetFields();
    sourceForm.setFieldsValue({ status: 'ACTIVE', type: 'manual', configJsonText: '{}' });
    sourceModal.showModal();
  }

  function openEditSourceModal(source: DataSource) {
    sourceForm.setFieldsValue({
      name: source.name,
      type: source.type,
      baseUrl: source.baseUrl,
      status: source.status,
      configJsonText: '{}',
    });
    sourceModal.showModal(source);
  }

  function handleSubmitSource(values: DataSourceFormValues) {
    let configJson: Record<string, unknown>;
    try {
      configJson = parseJsonObject(values.configJsonText);
    } catch (error) {
      notify.error(error, 'Config JSON không hợp lệ.');
      return;
    }

    const payload: DataSourcePayload = {
      name: values.name,
      type: values.type || 'manual',
      baseUrl: values.baseUrl || null,
      status: values.status ?? 'ACTIVE',
      configJson,
    };

    if (sourceModal.data) {
      updateSourceMutation.mutate({ id: sourceModal.data.id, payload });
      return;
    }
    createSourceMutation.mutate(payload);
  }

  const error = dataSourcesQuery.error ?? syncRunsQuery.error ?? rawSnapshotsQuery.error;
  const activeSource = dataSourceDetailQuery.data ?? sourceDrawer.data;
  const activeSyncRun = syncRunDetailQuery.data ?? syncDrawer.data;
  const activeSnapshot = snapshotDetailQuery.data ?? snapshotDrawer.data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Quản Lý Nguồn Dữ Liệu & Import"
        description="Source Registry, sync runs, raw snapshots và batch import dữ liệu chuẩn hóa vào Core."
        onRefresh={refreshAll}
        actions={
          <Space>
            <Button icon={<PlusOutlined />} onClick={openCreateSourceModal}>
              Thêm nguồn
            </Button>
            <Button type="primary" icon={<CloudUploadOutlined />} onClick={() => importModal.showModal()} style={{ background: '#4f46e5' }}>
              Import batch
            </Button>
          </Space>
        }
      />

      {error && (
        <Alert type="error" showIcon message="Không tải được dữ liệu ingestion" description={extractErrorMessage(error)} />
      )}

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Tổng đợt Sync Runs" value={syncRunsQuery.data?.total ?? 0} prefix={<SyncOutlined style={{ color: '#4f46e5' }} />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Raw Snapshots Đã Lưu" value={rawSnapshotsQuery.data?.total ?? 0} prefix={<DatabaseOutlined style={{ color: '#16a34a' }} />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Bản ghi đã xử lý" value={formatNumber(syncRunsQuery.data?.items.reduce((sum, item) => sum + item.successCount, 0) ?? 0)} prefix={<FileTextOutlined style={{ color: '#9333ea' }} />} />
          </Card>
        </Col>
      </Row>

      <Tabs
        items={[
          {
            key: 'sources',
            label: 'Nguồn dữ liệu',
            children: (
              <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <CoreTable<DataSource>
                  dataSource={dataSourcesQuery.data ?? []}
                  rowKey="id"
                  loading={dataSourcesQuery.isLoading || syncRunsQuery.isLoading}
                  columns={[
                    {
                      title: 'Tên nguồn dữ liệu',
                      dataIndex: 'name',
                      render: (name: string) => (
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{name}</span>
                      ),
                    },
                    { title: 'Loại nguồn', dataIndex: 'type', render: (type: string) => <Tag color="purple">{type}</Tag> },
                    { title: 'Base URL', dataIndex: 'baseUrl', render: (baseUrl: string | null) => baseUrl || '-' },
                    { title: 'Sync gần nhất', dataIndex: 'id', render: (id: string) => formatDateTime(latestSyncBySourceId.get(id)) },
                    { title: 'Số bản ghi', dataIndex: 'id', render: (id: string) => <strong>{formatNumber(recordsBySourceId.get(id) ?? 0)} bản ghi</strong> },
                    { title: 'Trạng thái', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
                    {
                      title: 'Thao tác',
                      key: 'actions',
                      render: (_, record) => (
                        <Space size={4}>
                          <Button type="text" icon={<EyeOutlined />} onClick={() => sourceDrawer.showModal(record)}>Chi tiết</Button>
                          <Button type="text" icon={<EditOutlined />} onClick={() => openEditSourceModal(record)}>Sửa</Button>
                        </Space>
                      ),
                    },
                  ]}
                />
              </Card>
            ),
          },
          {
            key: 'sync-runs',
            label: 'Sync runs',
            children: (
              <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <CoreTable<SyncRun>
                  dataSource={syncRunsQuery.data?.items ?? []}
                  rowKey="id"
                  loading={syncRunsQuery.isLoading}
                  columns={[
                    { title: 'Nguồn', dataIndex: 'dataSourceId', render: (id: string) => sourceNameById.get(id) ?? id },
                    { title: 'Tổng', dataIndex: 'totalRecords', render: formatNumber },
                    { title: 'Thành công', dataIndex: 'successCount', render: formatNumber },
                    { title: 'Lỗi', dataIndex: 'failedCount', render: formatNumber },
                    { title: 'Bắt đầu', dataIndex: 'startedAt', render: (value: string | null) => formatDateTime(value) },
                    { title: 'Kết thúc', dataIndex: 'finishedAt', render: (value: string | null) => formatDateTime(value) },
                    { title: 'Trạng thái', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
                    { title: 'Thao tác', key: 'actions', render: (_, record) => <Button type="text" icon={<EyeOutlined />} onClick={() => syncDrawer.showModal(record)}>Chi tiết</Button> },
                  ]}
                />
              </Card>
            ),
          },
          {
            key: 'raw-snapshots',
            label: 'Raw snapshots',
            children: (
              <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <CoreTable<RawSnapshot>
                  dataSource={rawSnapshotsQuery.data?.items ?? []}
                  rowKey="id"
                  loading={rawSnapshotsQuery.isLoading}
                  columns={[
                    { title: 'Nguồn', dataIndex: 'dataSourceId', render: (id: string) => sourceNameById.get(id) ?? id },
                    { title: 'Sync run', dataIndex: 'syncRunId', render: (id: string | null) => id || '-' },
                    { title: 'Content type', dataIndex: 'contentType' },
                    { title: 'Parse', dataIndex: 'parseStatus', render: (status: string) => <StatusTag status={status} /> },
                    { title: 'Ngày tạo', dataIndex: 'createdAt', render: (value: string) => formatDateTime(value) },
                    { title: 'Thao tác', key: 'actions', render: (_, record) => <Button type="text" icon={<EyeOutlined />} onClick={() => snapshotDrawer.showModal(record)}>Chi tiết</Button> },
                  ]}
                />
              </Card>
            ),
          },
        ]}
      />

      <Modal
        open={sourceModal.open}
        title={sourceModal.data ? 'Cập nhật nguồn dữ liệu' : 'Thêm nguồn dữ liệu'}
        okText={sourceModal.data ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        confirmLoading={createSourceMutation.isPending || updateSourceMutation.isPending}
        onOk={() => sourceForm.submit()}
        onCancel={sourceModal.hideModal}
        destroyOnHidden
      >
        <Form<DataSourceFormValues> form={sourceForm} layout="vertical" onFinish={handleSubmitSource}>
          <Form.Item name="name" label="Tên nguồn" rules={[{ required: true, message: 'Nhập tên nguồn.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại nguồn">
            <Input placeholder="manual, crawler, ecommerce_api..." />
          </Form.Item>
          <Form.Item name="baseUrl" label="Base URL">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select options={statusOptions} />
          </Form.Item>
          <Form.Item name="configJsonText" label="Config JSON nội bộ">
            <Input.TextArea rows={4} placeholder='{"shopId":"12345"}' />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={importModal.open}
        title="Import batch"
        okText="Import"
        cancelText="Hủy"
        confirmLoading={importMutation.isPending}
        onOk={() => importForm.submit()}
        onCancel={importModal.hideModal}
        destroyOnHidden
        width={760}
      >
        <Form<ImportFormValues>
          form={importForm}
          layout="vertical"
          initialValues={{ kind: 'products' }}
          onFinish={(values) => importMutation.mutate(values)}
        >
          <Space size={16} style={{ width: '100%' }} align="start">
            <Form.Item name="kind" label="Loại import" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select options={[{ value: 'products', label: 'Products' }, { value: 'reviews', label: 'Reviews' }]} />
            </Form.Item>
            <Form.Item name="dataSourceId" label="Nguồn dữ liệu" rules={[{ required: true, message: 'Chọn nguồn.' }]} style={{ flex: 1 }}>
              <Select showSearch optionFilterProp="label" options={sourceOptions} />
            </Form.Item>
          </Space>
          <Form.Item name="itemsText" label="Items JSON array" rules={[{ required: true, message: 'Nhập JSON array.' }]}>
            <Input.TextArea rows={10} placeholder='[{"sourceProductId":"SRC-1","title":"Sản phẩm","sellerId":"...","categoryId":"..."}]' />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer title="Chi tiết nguồn dữ liệu" open={sourceDrawer.open} onClose={sourceDrawer.hideModal} width={520}>
        {dataSourceDetailQuery.isError && <Alert type="error" showIcon message="Không tải được chi tiết" description={extractErrorMessage(dataSourceDetailQuery.error)} />}
        {activeSource && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Tên">{activeSource.name}</Descriptions.Item>
            <Descriptions.Item label="Loại">{activeSource.type}</Descriptions.Item>
            <Descriptions.Item label="Base URL">{activeSource.baseUrl || '-'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái"><StatusTag status={activeSource.status} /></Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{formatDateTime(activeSource.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="Cập nhật">{formatDateTime(activeSource.updatedAt)}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      <Drawer title="Chi tiết sync run" open={syncDrawer.open} onClose={syncDrawer.hideModal} width={560}>
        {syncRunDetailQuery.isError && <Alert type="error" showIcon message="Không tải được chi tiết" description={extractErrorMessage(syncRunDetailQuery.error)} />}
        {activeSyncRun && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Nguồn">{sourceNameById.get(activeSyncRun.dataSourceId) ?? activeSyncRun.dataSourceId}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái"><StatusTag status={activeSyncRun.status} /></Descriptions.Item>
            <Descriptions.Item label="Tổng bản ghi">{formatNumber(activeSyncRun.totalRecords)}</Descriptions.Item>
            <Descriptions.Item label="Thành công">{formatNumber(activeSyncRun.successCount)}</Descriptions.Item>
            <Descriptions.Item label="Lỗi">{formatNumber(activeSyncRun.failedCount)}</Descriptions.Item>
            <Descriptions.Item label="Error summary">{activeSyncRun.errorSummary || '-'}</Descriptions.Item>
            <Descriptions.Item label="Bắt đầu">{formatDateTime(activeSyncRun.startedAt)}</Descriptions.Item>
            <Descriptions.Item label="Kết thúc">{formatDateTime(activeSyncRun.finishedAt)}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      <Drawer title="Chi tiết raw snapshot" open={snapshotDrawer.open} onClose={snapshotDrawer.hideModal} width={560}>
        {snapshotDetailQuery.isError && <Alert type="error" showIcon message="Không tải được chi tiết" description={extractErrorMessage(snapshotDetailQuery.error)} />}
        {activeSnapshot && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Nguồn">{sourceNameById.get(activeSnapshot.dataSourceId) ?? activeSnapshot.dataSourceId}</Descriptions.Item>
            <Descriptions.Item label="Sync run">{activeSnapshot.syncRunId || '-'}</Descriptions.Item>
            <Descriptions.Item label="Content type">{activeSnapshot.contentType}</Descriptions.Item>
            <Descriptions.Item label="Content hash">{activeSnapshot.contentHash || '-'}</Descriptions.Item>
            <Descriptions.Item label="Storage key">{activeSnapshot.objectStorageKey || '-'}</Descriptions.Item>
            <Descriptions.Item label="Parse status"><StatusTag status={activeSnapshot.parseStatus} /></Descriptions.Item>
            <Descriptions.Item label="Error">{activeSnapshot.errorMessage || '-'}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{formatDateTime(activeSnapshot.createdAt)}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
