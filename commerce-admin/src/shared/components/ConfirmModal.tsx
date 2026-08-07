import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmLoading?: boolean;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
}

export function ConfirmModal({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmLoading = false,
  okText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  danger = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExclamationCircleOutlined style={{ color: danger ? '#ef4444' : '#faad14', fontSize: 20 }} />
          <span>{title}</span>
        </div>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger }}
      centered
      destroyOnClose
    >
      <Typography.Paragraph style={{ marginTop: 12, marginBottom: 12, color: '#475569' }}>
        {content}
      </Typography.Paragraph>
    </Modal>
  );
}
