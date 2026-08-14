import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { CoreTable } from '@/shared/components/CoreTable';
import { extractErrorMessage } from '@/shared/utils/error-handler';
import { useModalState, useNotification } from '@/shared/hooks';
import {
  createCategory,
  createCategoryAttribute,
  deleteCategory,
  deleteCategoryAttribute,
  fetchCategories,
  fetchCategoryAttributes,
  updateCategory,
  updateCategoryAttribute,
} from './category.api';
import type {
  Category,
  CategoryAttribute,
  CategoryAttributePayload,
  CategoryPayload,
  UpdateCategoryAttributePayload,
} from './category.types';

const statusOptions = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'INACTIVE', label: 'INACTIVE' },
];

const dataTypeOptions = [
  { value: 'text', label: 'text' },
  { value: 'number', label: 'number' },
  { value: 'boolean', label: 'boolean' },
  { value: 'select', label: 'select' },
  { value: 'multi_select', label: 'multi_select' },
];

interface CategoryFormValues extends CategoryPayload {}

interface AttributeFormValues extends Omit<CategoryAttributePayload, 'optionsJson'> {
  optionsJsonText?: string;
}

function stringifyJson(value?: Record<string, unknown> | null) {
  if (!value || Object.keys(value).length === 0) return '{}';
  return JSON.stringify(value, null, 2);
}

function parseObjectJson(input?: string): Record<string, unknown> | undefined {
  if (!input?.trim()) return undefined;
  const value = JSON.parse(input) as unknown;
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    throw new Error('JSON phải là object.');
  }
  return value as Record<string, unknown>;
}

export function getCategoryParentLabel(category: Category, categories: Category[]): string {
  if (!category.parentId) return '-';
  return categories.find((item) => item.id === category.parentId)?.name ?? '-';
}

export function CategoriesPage() {
  const notify = useNotification();
  const queryClient = useQueryClient();
  const [categoryForm] = Form.useForm<CategoryFormValues>();
  const [attributeForm] = Form.useForm<AttributeFormValues>();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const categoryModal = useModalState<Category>();
  const deleteModal = useModalState<Category>();
  const attributeModal = useModalState<CategoryAttribute>();
  const deleteAttributeModal = useModalState<CategoryAttribute>();

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const attributesQuery = useQuery({
    queryKey: ['category-attributes', selectedCategory?.id],
    queryFn: () => fetchCategoryAttributes(selectedCategory?.id as string),
    enabled: Boolean(selectedCategory),
  });

  const filteredData = useMemo(
    () =>
      (categoriesQuery.data ?? []).filter((item) => {
        const keyword = searchText.trim().toLowerCase();
        if (!keyword) return true;
        const parentLabel = getCategoryParentLabel(item, categoriesQuery.data ?? []);
        return (
          item.name.toLowerCase().includes(keyword) ||
          item.slug.toLowerCase().includes(keyword) ||
          parentLabel.toLowerCase().includes(keyword)
        );
      }),
    [categoriesQuery.data, searchText],
  );

  const parentOptions = useMemo(
    () =>
      (categoriesQuery.data ?? [])
        .filter((category) => category.id !== categoryModal.data?.id)
        .map((category) => ({
          value: category.id,
          label: category.name,
        })),
    [categoriesQuery.data, categoryModal.data?.id],
  );

  const refreshCategories = async () => {
    await queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const refreshAttributes = async () => {
    await queryClient.invalidateQueries({ queryKey: ['category-attributes', selectedCategory?.id] });
  };

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      notify.success('Đã tạo danh mục.');
      categoryForm.resetFields();
      categoryModal.hideModal();
      await refreshCategories();
    },
    onError: (error) => notify.error(error, 'Tạo danh mục thất bại.'),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryPayload }) => updateCategory(id, payload),
    onSuccess: async () => {
      notify.success('Đã cập nhật danh mục.');
      categoryForm.resetFields();
      categoryModal.hideModal();
      await refreshCategories();
    },
    onError: (error) => notify.error(error, 'Cập nhật danh mục thất bại.'),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      notify.success('Đã xóa danh mục.');
      deleteModal.hideModal();
      await refreshCategories();
    },
    onError: (error) => notify.error(error, 'Xóa danh mục thất bại.'),
  });

  const createAttributeMutation = useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: string; payload: CategoryAttributePayload }) =>
      createCategoryAttribute(categoryId, payload),
    onSuccess: async () => {
      notify.success('Đã tạo thuộc tính danh mục.');
      attributeForm.resetFields();
      attributeModal.hideModal();
      await refreshAttributes();
    },
    onError: (error) => notify.error(error, 'Tạo thuộc tính thất bại.'),
  });

  const updateAttributeMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryAttributePayload }) =>
      updateCategoryAttribute(id, payload),
    onSuccess: async () => {
      notify.success('Đã cập nhật thuộc tính danh mục.');
      attributeForm.resetFields();
      attributeModal.hideModal();
      await refreshAttributes();
    },
    onError: (error) => notify.error(error, 'Cập nhật thuộc tính thất bại.'),
  });

  const deleteAttributeMutation = useMutation({
    mutationFn: deleteCategoryAttribute,
    onSuccess: async () => {
      notify.success('Đã xóa thuộc tính danh mục.');
      deleteAttributeModal.hideModal();
      await refreshAttributes();
    },
    onError: (error) => notify.error(error, 'Xóa thuộc tính thất bại.'),
  });

  const categoryMutationPending = createCategoryMutation.isPending || updateCategoryMutation.isPending;
  const attributeMutationPending = createAttributeMutation.isPending || updateAttributeMutation.isPending;

  function openCreateCategory() {
    categoryForm.resetFields();
    categoryForm.setFieldsValue({ status: 'ACTIVE' });
    categoryModal.showModal();
  }

  function openEditCategory(category: Category) {
    categoryForm.setFieldsValue({
      name: category.name,
      slug: category.slug,
      status: category.status,
    });
    categoryModal.showModal(category);
  }

  function submitCategory(values: CategoryFormValues) {
    const payload: CategoryPayload = {
      parentId: categoryModal.data ? undefined : values.parentId ?? undefined,
      name: values.name,
      slug: values.slug || undefined,
      status: values.status ?? 'ACTIVE',
    };

    if (categoryModal.data) {
      updateCategoryMutation.mutate({ id: categoryModal.data.id, payload });
      return;
    }
    createCategoryMutation.mutate(payload);
  }

  function openAttributes(category: Category) {
    setSelectedCategory(category);
  }

  function openCreateAttribute() {
    attributeForm.resetFields();
    attributeForm.setFieldsValue({
      dataType: 'text',
      isFilterable: false,
      isSearchable: false,
      isRequired: false,
      optionsJsonText: '{}',
    });
    attributeModal.showModal();
  }

  function openEditAttribute(attribute: CategoryAttribute) {
    attributeForm.setFieldsValue({
      code: attribute.code,
      label: attribute.label,
      dataType: attribute.dataType,
      isFilterable: attribute.isFilterable,
      isSearchable: attribute.isSearchable,
      isRequired: attribute.isRequired,
      unit: attribute.unit ?? undefined,
      optionsJsonText: stringifyJson(attribute.optionsJson),
    });
    attributeModal.showModal(attribute);
  }

  function submitAttribute(values: AttributeFormValues) {
    if (!selectedCategory) return;

    let optionsJson: Record<string, unknown> | undefined;
    try {
      optionsJson = parseObjectJson(values.optionsJsonText);
    } catch (error) {
      notify.error(error, 'Options JSON không hợp lệ.');
      return;
    }

    if (attributeModal.data) {
      updateAttributeMutation.mutate({
        id: attributeModal.data.id,
        payload: {
          label: values.label,
          dataType: values.dataType,
          isFilterable: values.isFilterable,
          isSearchable: values.isSearchable,
          isRequired: values.isRequired,
          unit: values.unit || null,
          optionsJson,
        },
      });
      return;
    }

    createAttributeMutation.mutate({
      categoryId: selectedCategory.id,
      payload: {
        code: values.code,
        label: values.label,
        dataType: values.dataType,
        isFilterable: values.isFilterable,
        isSearchable: values.isSearchable,
        isRequired: values.isRequired,
        unit: values.unit || null,
        optionsJson,
      },
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 20 }}>
      <DataPageHeader
        title="Danh Mục Sản Phẩm"
        description="Quản lý cây danh mục và các thuộc tính động dùng cho catalog/filter."
        onRefresh={() => categoriesQuery.refetch()}
      />

      {categoriesQuery.isError && (
        <Alert
          type="error"
          showIcon
          message="Không tải được danh sách danh mục"
          description={extractErrorMessage(categoriesQuery.error)}
        />
      )}

      <Card
        style={{ borderRadius: 12, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
        bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 20 }}
      >
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên, slug hoặc parent..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            style={{ width: 340, borderRadius: 8 }}
            allowClear
          />
          <Space>
            <Tag color="indigo" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 12 }}>
              Tổng số: {filteredData.length} danh mục
            </Tag>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateCategory}>
              Tạo danh mục
            </Button>
          </Space>
        </div>

        <CoreTable<Category>
          rowKey="id"
          loading={categoriesQuery.isLoading}
          dataSource={filteredData}
          columns={[
            {
              title: 'Tên danh mục',
              dataIndex: 'name',
              width: 240,
              render: (text: string, record) => (
                <Space>
                  <span style={{ fontWeight: 600 }}>{text}</span>
                  <Tag color="blue" style={{ fontSize: 11 }}>{record.slug}</Tag>
                </Space>
              ),
            },
            {
              title: 'Parent',
              dataIndex: 'parentId',
              width: 180,
              render: (_parentId: string | null, record) => {
                const parentLabel = getCategoryParentLabel(record, categoriesQuery.data ?? []);
                return parentLabel === '-' ? '-' : <Tag color="default">{parentLabel}</Tag>;
              },
            },
            {
              title: 'Cấp độ',
              dataIndex: 'level',
              width: 120,
              render: (level: number) => <Tag color="purple">Cấp {level}</Tag>,
            },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              width: 130,
              render: (status: string) => <StatusTag status={status} />,
            },
            {
              title: 'Thao tác',
              key: 'actions',
              fixed: 'right',
              width: 220,
              align: 'right',
              render: (_, record) => (
                <Space size={4}>
                  <Tooltip title="Cấu hình thuộc tính">
                    <Button type="text" icon={<SettingOutlined style={{ color: '#6366f1' }} />} onClick={() => openAttributes(record)}>
                      Thuộc tính
                    </Button>
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <Button type="text" icon={<EditOutlined style={{ color: '#0284c7' }} />} onClick={() => openEditCategory(record)}>
                      Sửa
                    </Button>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteModal.showModal(record)}>
                      Xóa
                    </Button>
                  </Tooltip>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={categoryModal.open}
        title={categoryModal.data ? 'Cập nhật danh mục' : 'Tạo danh mục'}
        okText={categoryModal.data ? 'Cập nhật' : 'Tạo danh mục'}
        cancelText="Hủy"
        confirmLoading={categoryMutationPending}
        onOk={() => categoryForm.submit()}
        onCancel={categoryModal.hideModal}
        destroyOnHidden
      >
        <Form<CategoryFormValues> form={categoryForm} layout="vertical" onFinish={submitCategory}>
          {!categoryModal.data && (
            <Form.Item name="parentId" label="Danh mục cha">
              <Select allowClear showSearch options={parentOptions} optionFilterProp="label" placeholder="Không có danh mục cha" />
            </Form.Item>
          )}
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: 'Nhập tên danh mục.' }]}>
            <Input placeholder="Tai nghe" />
          </Form.Item>
          <Form.Item name="slug" label="Slug">
            <Input placeholder="tai-nghe" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        open={Boolean(selectedCategory)}
        title={
          <Space direction="vertical" size={0}>
            <Typography.Text strong>Thuộc tính danh mục</Typography.Text>
            <Typography.Text type="secondary">{selectedCategory?.name}</Typography.Text>
          </Space>
        }
        width={820}
        onClose={() => setSelectedCategory(null)}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateAttribute}>
            Thêm thuộc tính
          </Button>
        }
        destroyOnHidden
      >
        {attributesQuery.isError && (
          <Alert
            type="error"
            showIcon
            message="Không tải được thuộc tính danh mục"
            description={extractErrorMessage(attributesQuery.error)}
            style={{ marginBottom: 16 }}
          />
        )}
        <CoreTable<CategoryAttribute>
          rowKey="id"
          dataSource={attributesQuery.data ?? []}
          loading={attributesQuery.isLoading}
          pagination={false}
          scrollY={520}
          columns={[
            { title: 'Code', dataIndex: 'code', width: 140, render: (code: string) => <Typography.Text copyable>{code}</Typography.Text> },
            { title: 'Nhãn', dataIndex: 'label', width: 160 },
            { title: 'Kiểu dữ liệu', dataIndex: 'dataType', width: 130, render: (dataType: string) => <Tag color="geekblue">{dataType}</Tag> },
            { title: 'Filter', dataIndex: 'isFilterable', width: 90, render: (value: boolean) => value ? <Tag color="green">Có</Tag> : '-' },
            { title: 'Search', dataIndex: 'isSearchable', width: 90, render: (value: boolean) => value ? <Tag color="green">Có</Tag> : '-' },
            { title: 'Bắt buộc', dataIndex: 'isRequired', width: 100, render: (value: boolean) => value ? <Tag color="red">Có</Tag> : '-' },
            { title: 'Đơn vị', dataIndex: 'unit', width: 100, render: (unit: string | null) => unit || '-' },
            {
              title: 'Thao tác',
              key: 'actions',
              fixed: 'right',
              width: 140,
              align: 'right',
              render: (_, record) => (
                <Space size={4}>
                  <Button type="text" icon={<EditOutlined />} onClick={() => openEditAttribute(record)}>
                    Sửa
                  </Button>
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteAttributeModal.showModal(record)}>
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Drawer>

      <Modal
        open={attributeModal.open}
        title={attributeModal.data ? 'Cập nhật thuộc tính' : 'Tạo thuộc tính'}
        okText={attributeModal.data ? 'Cập nhật' : 'Tạo thuộc tính'}
        cancelText="Hủy"
        confirmLoading={attributeMutationPending}
        onOk={() => attributeForm.submit()}
        onCancel={attributeModal.hideModal}
        destroyOnHidden
        width={680}
      >
        <Form<AttributeFormValues> form={attributeForm} layout="vertical" onFinish={submitAttribute}>
          <Space size={16} style={{ width: '100%' }} align="start">
            <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Nhập code.' }]} style={{ flex: 1 }}>
              <Input disabled={Boolean(attributeModal.data)} placeholder="color" />
            </Form.Item>
            <Form.Item name="label" label="Nhãn" rules={[{ required: true, message: 'Nhập nhãn.' }]} style={{ flex: 1 }}>
              <Input placeholder="Màu sắc" />
            </Form.Item>
          </Space>
          <Space size={16} style={{ width: '100%' }} align="start">
            <Form.Item name="dataType" label="Kiểu dữ liệu" rules={[{ required: true, message: 'Chọn kiểu dữ liệu.' }]} style={{ flex: 1 }}>
              <Select options={dataTypeOptions} />
            </Form.Item>
            <Form.Item name="unit" label="Đơn vị" style={{ flex: 1 }}>
              <Input placeholder="cm, kg, GB..." />
            </Form.Item>
          </Space>
          <Space size={24} wrap>
            <Form.Item name="isFilterable" label="Filter" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="isSearchable" label="Search" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="isRequired" label="Bắt buộc" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>
          <Form.Item name="optionsJsonText" label="Options JSON">
            <Input.TextArea rows={4} placeholder='{"values":["Đen","Trắng"]}' />
          </Form.Item>
        </Form>
      </Modal>

      <ConfirmModal
        open={deleteModal.open}
        title="Xác nhận xóa danh mục"
        content={`Bạn có chắc chắn muốn xóa danh mục "${deleteModal.data?.name}" không?`}
        onConfirm={() => {
          if (deleteModal.data) deleteCategoryMutation.mutate(deleteModal.data.id);
        }}
        onCancel={deleteModal.hideModal}
        confirmLoading={deleteCategoryMutation.isPending}
        danger
        okText="Xóa danh mục"
      />

      <ConfirmModal
        open={deleteAttributeModal.open}
        title="Xác nhận xóa thuộc tính"
        content={`Bạn có chắc chắn muốn xóa thuộc tính "${deleteAttributeModal.data?.label}" không?`}
        onConfirm={() => {
          if (deleteAttributeModal.data) deleteAttributeMutation.mutate(deleteAttributeModal.data.id);
        }}
        onCancel={deleteAttributeModal.hideModal}
        confirmLoading={deleteAttributeMutation.isPending}
        danger
        okText="Xóa thuộc tính"
      />
    </div>
  );
}
