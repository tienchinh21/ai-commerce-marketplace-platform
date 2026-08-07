import { useState, ReactNode } from 'react';
import { Layout, Menu, Typography, Button, Avatar, Dropdown, Space, Tag, Input, Badge } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShopOutlined,
  UserOutlined,
  ShoppingOutlined,
  CommentOutlined,
  CloudUploadOutlined,
  SearchOutlined,
  RobotOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
  BellOutlined,
  GlobalOutlined,
  ThunderboltFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/auth.store';
import { adminRoutes } from '@/routes/route-permissions';

import { ROUTES } from '@/shared/constants/routes.constants';

const { Header, Sider, Content } = Layout;

const iconMap: Record<string, ReactNode> = {
  [ROUTES.DASHBOARD]: <DashboardOutlined />,
  [ROUTES.CATEGORIES]: <AppstoreOutlined />,
  [ROUTES.PRODUCTS]: <ShoppingOutlined />,
  [ROUTES.SELLERS]: <ShopOutlined />,
  [ROUTES.BUYERS]: <UserOutlined />,
  [ROUTES.REVIEWS]: <CommentOutlined />,
  [ROUTES.INGESTION]: <CloudUploadOutlined />,
  [ROUTES.AI_SEARCH]: <SearchOutlined />,
  [ROUTES.REVIEW_INTELLIGENCE]: <BarChartOutlined />,
  [ROUTES.ANALYST_CHAT]: <RobotOutlined />,
  [ROUTES.USERS_PERMISSIONS]: <SafetyCertificateOutlined />,
};

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const visibleRoutes = adminRoutes.filter(
    (item) => !item.permission || auth.hasPermission(item.permission),
  );

  const menuGroups: Record<string, typeof visibleRoutes> = {};
  for (const route of visibleRoutes) {
    const groupName = route.group ?? 'Khác';
    if (!menuGroups[groupName]) {
      menuGroups[groupName] = [];
    }
    menuGroups[groupName].push(route);
  }

  const menuItems = Object.entries(menuGroups).map(([groupName, routes]) => ({
    key: `group-${groupName}`,
    label: !collapsed ? (
      <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {groupName}
      </span>
    ) : null,
    type: 'group' as const,
    children: routes.map((item) => ({
      key: item.path,
      icon: iconMap[item.path],
      label: item.label,
    })),
  }));

  function handleLogout() {
    auth.clearSession();
    navigate(ROUTES.LOGIN);
  }

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Hồ sơ người dùng',
      },
      {
        key: 'settings',
        icon: <GlobalOutlined />,
        label: 'Cấu hình hệ thống',
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        danger: true,
        label: 'Đăng xuất',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
        width={260}
        collapsedWidth={80}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '1px 0 4px 0 rgba(0, 0, 0, 0.02)',
          zIndex: 10,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12,
            padding: collapsed ? '0' : '0 20px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#2563eb',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            <ThunderboltFilled />
          </div>
          {!collapsed && (
            <div>
              <div style={{ color: '#0f172a', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
                OKZ Commerce
              </div>
              <div style={{ color: '#64748b', fontSize: 11, fontWeight: 500 }}>
                AI Admin Platform
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div style={{ padding: '12px 8px' }}>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={(item) => navigate(item.key)}
            style={{ background: 'transparent', borderRight: 0 }}
          />
        </div>
      </Sider>

      <Layout>
        {/* Top Navbar Header */}
        <Header
          style={{
            background: '#ffffff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Space size={16}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: 18 }} /> : <MenuFoldOutlined style={{ fontSize: 18 }} />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ width: 38, height: 38 }}
            />
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Tìm kiếm danh mục, sản phẩm, dữ liệu..."
              style={{ width: 300, borderRadius: 8, background: '#f8fafc' }}
              variant="filled"
            />
            <Tag color="blue" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
              Phase 1 Admin Mode
            </Tag>
          </Space>

          <Space size={20}>
            <Badge count={3} size="small" offset={[-2, 4]}>
              <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 18, color: '#64748b' }} />} />
            </Badge>

            <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 8 }}>
                <Avatar style={{ backgroundColor: '#2563eb', fontWeight: 600 }}>
                  {(auth.user?.displayName ?? 'Admin')[0].toUpperCase()}
                </Avatar>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', lineHeight: 1.2 }}>
                    {auth.user?.displayName ?? 'Quản trị viên'}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    {auth.user?.email ?? 'admin@okz.vn'}
                  </div>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Content Area */}
        <Content style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
