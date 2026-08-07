import { useState, useMemo } from 'react';
import { Card, Table, Tag, Input, Space, Button, Rate, Badge } from 'antd';
import { SearchOutlined, PlusOutlined, ShoppingOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DataPageHeader } from '@/shared/components/DataPageHeader';
import { StatusTag } from '@/shared/components/StatusTag';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { formatCurrency } from '@/shared/utils/formatters';
import { useDebounce, useModalState, useNotification } from '@/shared/hooks';
import { ROUTES } from '@/shared/constants/routes.constants';

interface ProductItem {
  id: string;
  title: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  reviews: number;
  status: string;
}

const initialMockProducts: ProductItem[] = [
  { id: 'prod-1', title: 'Tai nghe Bluetooth Anker Soundcore Life Q30', category: 'Electronics', brand: 'Anker', price: 1790000, rating: 4.8, reviews: 340, status: 'ACTIVE' },
  { id: 'prod-2', title: 'Áo thun Nam gia nhiệt Coolmate Active Ultra', category: 'Fashion', brand: 'Coolmate', price: 299000, rating: 4.9, reviews: 820, status: 'ACTIVE' },
  { id: 'prod-3', title: 'Tẩy tế bào chết Cà phê Đắc Lắk Cocoon 200ml', category: 'Beauty', brand: 'Cocoon', price: 145000, rating: 4.9, reviews: 1420, status: 'ACTIVE' },
  { id: 'prod-4', title: 'Giày Chạy Bộ Nam Run Active Decathlon', category: 'Sports-Outdoor', brand: 'Decathlon', price: 899000, rating: 4.7, reviews: 190, status: 'ACTIVE' },
];

export function ProductsPage() {
  const navigate = useNavigate();
  const notify = useNotification();
  const [products, setProducts] = useState<ProductItem[]>(initialMockProducts);
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const deleteModal = useModalState<ProductItem>();

  const filteredProducts = useMemo(() => {
    if (!debouncedKeyword.trim()) return products;
    const query = debouncedKeyword.toLowerCase();
    return products.filter(
      (p) => p.title.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
  }, [products, debouncedKeyword]);

  const handleDeleteConfirm = () => {
    if (!deleteModal.data) return;
    const targetId = deleteModal.data.id;
    setProducts((prev) => prev.filter((p) => p.id !== targetId));
    notify.success(`Đã xóa sản phẩm "${deleteModal.data.title}" thành công.`);
    deleteModal.hideModal();
  };

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <DataPageHeader
        title="Quản Lý Sản Phẩm (Catalog Products)"
        description="Quản lý thông tin sản phẩm chuẩn hóa (Canonical Products), biến thể, hình ảnh và thuộc tính kỹ thuật specs_json."
      />

      <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm theo tên sản phẩm, thương hiệu..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: 340, borderRadius: 8 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} style={{ background: '#2563eb', fontWeight: 600 }}>
            Tạo Sản Phẩm Mới
          </Button>
        </div>

        <Table
          dataSource={filteredProducts}
          rowKey="id"
          columns={[
            {
              title: 'Sản phẩm',
              dataIndex: 'title',
              render: (title, record) => (
                <Space>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f1f5f9', display: 'grid', placeItems: 'center', color: '#6366f1' }}>
                    <ShoppingOutlined />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{title}</div>
                    <Tag color="cyan" style={{ fontSize: 11 }}>Hãng: {record.brand}</Tag>
                  </div>
                </Space>
              ),
            },
            { title: 'Danh mục', dataIndex: 'category', render: (cat) => <Tag color="blue">{cat}</Tag> },
            {
              title: 'Giá hiển thị',
              dataIndex: 'price',
              render: (price) => <span style={{ fontWeight: 700, color: '#16a34a' }}>{formatCurrency(price)}</span>,
            },
            {
              title: 'Đánh giá & Phản hồi',
              dataIndex: 'rating',
              render: (rating, record) => (
                <Space>
                  <Rate disabled defaultValue={rating} style={{ fontSize: 13 }} />
                  <span style={{ fontWeight: 600 }}>{rating}</span>
                  <Badge count={`${record.reviews} review`} style={{ backgroundColor: '#e2e8f0', color: '#475569' }} />
                </Space>
              ),
            },
            { title: 'Trạng thái', dataIndex: 'status', render: (status) => <StatusTag status={status} /> },
            {
              title: 'Thao tác',
              key: 'action',
              render: (_, record) => (
                <Space size={4}>
                  <Button
                    type="text"
                    icon={<EyeOutlined style={{ color: '#2563eb' }} />}
                    onClick={() => navigate(ROUTES.PRODUCT_DETAIL(record.id))}
                  >
                    Chi tiết
                  </Button>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteModal.showModal(record)}
                  >
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <ConfirmModal
        open={deleteModal.open}
        title="Xác nhận xóa sản phẩm"
        content={`Bạn có chắc chắn muốn xóa sản phẩm "${deleteModal.data?.title}" khỏi catalog không? Thao tác này không thể hoàn tác.`}
        onConfirm={handleDeleteConfirm}
        onCancel={deleteModal.hideModal}
        danger
        okText="Xóa sản phẩm"
      />
    </Space>
  );
}
