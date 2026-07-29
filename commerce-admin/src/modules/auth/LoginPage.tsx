import { Button, Card, Form, Input, Typography, message } from 'antd';
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

  async function handleFinish(values: LoginFormValues) {
    try {
      const result = await login(values.email, values.password);
      auth.setSession(result.accessToken, result.user);
      navigate('/');
    } catch {
      message.error('Không đăng nhập được. Kiểm tra email hoặc mật khẩu.');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f5f5f5' }}>
      <Card style={{ width: 380 }}>
        <Typography.Title level={3}>Commerce Admin</Typography.Title>
        <Form layout="vertical" onFinish={handleFinish} initialValues={{ email: 'admin@example.com', password: 'password' }}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}
