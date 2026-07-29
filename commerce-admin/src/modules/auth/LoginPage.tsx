import { useState } from 'react';
import { Button, Card, Form, Input, Typography, message, Checkbox, Space } from 'antd';
import { LockOutlined, MailOutlined, ThunderboltFilled, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from './auth.api';
import { useAuth } from './auth.store';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleFinish(values: LoginFormValues) {
    setLoading(true);
    try {
      const result = await login(values.email, values.password);
      auth.setSession(result.accessToken, result.user);
      message.success('Đăng nhập thành công! Đang chuyển hướng...');
      navigate('/');
    } catch {
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0f172a',
        position: 'relative',
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 12,
          background: '#1e293b',
          border: '1px solid #334155',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          padding: '8px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: '#2563eb',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontSize: 24,
              margin: '0 auto 12px',
            }}
          >
            <ThunderboltFilled />
          </div>
          <Typography.Title level={3} style={{ color: '#f8fafc', margin: 0, fontWeight: 700 }}>
            Hệ Thống Quản Trị
          </Typography.Title>
          <Typography.Text style={{ color: '#94a3b8', fontSize: 13 }}>
            AI Commerce Marketplace Platform
          </Typography.Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ email: 'admin@example.com', password: 'password' }}
          size="large"
        >
          <Form.Item
            name="email"
            label={<span style={{ color: '#cbd5e1', fontWeight: 500 }}>Email quản trị</span>}
            rules={[{ required: true, message: 'Vui lòng nhập Email', type: 'email' }]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#64748b' }} />}
              placeholder="admin@example.com"
              style={{ background: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: '#cbd5e1', fontWeight: 500 }}>Mật khẩu</span>}
            rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#64748b' }} />}
              placeholder="••••••••"
              style={{ background: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <Checkbox style={{ color: '#94a3b8', fontSize: 13 }} defaultChecked>
              Ghi nhớ đăng nhập
            </Checkbox>
            <a style={{ color: '#38bdf8', fontSize: 13 }}>Quên mật khẩu?</a>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: 44,
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 8,
              background: '#2563eb',
              border: 0,
            }}
          >
            Đăng nhập hệ thống
          </Button>
        </Form>

        <div style={{ marginTop: 24, textAlign: 'center', borderTop: '1px solid #334155', paddingTop: 14 }}>
          <Space style={{ color: '#64748b', fontSize: 12 }}>
            <SafetyCertificateOutlined /> Bảo mật theo chuẩn RBAC Permission
          </Space>
        </div>
      </Card>
    </div>
  );
}
