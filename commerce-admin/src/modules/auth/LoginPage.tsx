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
        background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Glow Elements */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
          top: '-10%',
          left: '20%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(0,0,0,0) 70%)',
          bottom: '-10%',
          right: '20%',
          pointerEvents: 'none',
        }}
      />

      <Card
        style={{
          width: 420,
          borderRadius: 16,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: '12px 8px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontSize: 26,
              margin: '0 auto 16px',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
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
              style={{ background: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
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
              style={{ background: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <Checkbox style={{ color: '#94a3b8', fontSize: 13 }} defaultChecked>
              Ghi nhớ đăng nhập
            </Checkbox>
            <a style={{ color: '#818cf8', fontSize: 13 }}>Quên mật khẩu?</a>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: 46,
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              border: 0,
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)',
            }}
          >
            Đăng nhập hệ thống
          </Button>
        </Form>

        <div style={{ marginTop: 28, textAlign: 'center', borderTop: '1px solid #1e293b', paddingTop: 16 }}>
          <Space style={{ color: '#64748b', fontSize: 12 }}>
            <SafetyCertificateOutlined /> Bảo mật theo chuẩn RBAC Permission
          </Space>
        </div>
      </Card>
    </div>
  );
}
