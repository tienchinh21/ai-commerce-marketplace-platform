import { Layout, Menu, Typography, Button } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/auth.store';
import { adminRoutes } from '../routes/route-permissions';

const { Header, Sider, Content } = Layout;

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const visibleItems = adminRoutes
    .filter((item) => !item.permission || auth.hasPermission(item.permission))
    .map((item) => ({ key: item.path, label: item.label }));

  function handleLogout() {
    auth.clearSession();
    navigate('/login');
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={248}>
        <div style={{ color: '#fff', padding: 16, fontWeight: 700, fontSize: 16 }}>Commerce Admin</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={visibleItems}
          onClick={(item) => navigate(item.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <Typography.Text type="secondary">AI Commerce Marketplace Platform</Typography.Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Typography.Text strong>{auth.user?.displayName ?? 'Admin'}</Typography.Text>
            <Button size="small" onClick={handleLogout}>Đăng xuất</Button>
          </div>
        </Header>
        <Content style={{ padding: 24, background: '#f5f5f5' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
