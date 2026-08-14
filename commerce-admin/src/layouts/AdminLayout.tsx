import { useState, ReactNode } from 'react';
import { Layout, Menu, Typography, Button, Avatar, Dropdown, Space, Input, Badge, Tooltip, theme } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShopOutlined,
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
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
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/auth.store';
import { logout } from '@/modules/auth/auth.api';
import { adminRoutes } from '@/routes/route-permissions';
import { useTheme } from '@/shared/theme';

import { ROUTES } from '@/shared/constants/routes.constants';

const { Header, Sider, Content } = Layout;

const iconMap: Record<string, ReactNode> = {
  [ROUTES.DASHBOARD]: <DashboardOutlined />,
  [ROUTES.CATEGORIES]: <AppstoreOutlined />,
  [ROUTES.PRODUCTS]: <ShoppingOutlined />,
  [ROUTES.ORDERS]: <ShoppingCartOutlined />,
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
  const { isDark, toggleTheme } = useTheme();
  const { token } = theme.useToken();

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
      <span style={{ fontSize: 11, fontWeight: 700, color: token.colorTextSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Ignore network error on logout
    } finally {
      auth.clearSession();
      navigate(ROUTES.LOGIN);
    }
  }

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Hồ sơ người dùng',
      },
      {
        key: 'theme',
        icon: isDark ? <SunOutlined /> : <MoonOutlined />,
        label: isDark ? 'Giao diện: Sáng' : 'Giao diện: Tối',
        onClick: toggleTheme,
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
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <Sider
        theme={isDark ? 'dark' : 'light'}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
        width={260}
        collapsedWidth={80}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorder}`,
          boxShadow: isDark ? '1px 0 6px 0 rgba(0, 0, 0, 0.4)' : '1px 0 4px 0 rgba(0, 0, 0, 0.02)',
          zIndex: 100,
        }}
      >
        {/* Navigation Menu */}
        <div style={{ padding: '12px 8px' }}>
          <Menu
            theme={isDark ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={(item) => navigate(item.key)}
            style={{ background: 'transparent', borderRight: 0 }}
          />
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'margin-left 0.2s', minHeight: '100vh', background: token.colorBgLayout }}>
        {/* Top Navbar Header */}
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 99,
            width: '100%',
            background: token.colorBgContainer,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
            lineHeight: 'normal',
            boxShadow: isDark ? '0 1px 4px 0 rgba(0, 0, 0, 0.4)' : '0 1px 3px 0 rgb(0 0 0 / 0.05)',
            borderBottom: `1px solid ${token.colorBorder}`,
          }}
        >
          <Space size={16} align="center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: 18 }} /> : <MenuFoldOutlined style={{ fontSize: 18 }} />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ width: 38, height: 38 }}
            />
            <Input
              prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
              placeholder="Tìm kiếm danh mục, sản phẩm, dữ liệu..."
              style={{ width: 320, borderRadius: 8, background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc' }}
              variant="filled"
            />
          </Space>

          <Space size={16} align="center">
            <Tooltip title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}>
              <Button
                type="text"
                shape="circle"
                icon={
                  isDark ? (
                    <SunOutlined style={{ fontSize: 18, color: '#facc15' }} />
                  ) : (
                    <MoonOutlined style={{ fontSize: 18, color: '#64748b' }} />
                  )
                }
                onClick={toggleTheme}
              />
            </Tooltip>

            <Badge count={3} size="small" offset={[-2, 4]}>
              <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 18, color: token.colorTextSecondary }} />} />
            </Badge>

            <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
              <Space align="center" style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 8 }}>
                <Avatar style={{ backgroundColor: '#2563eb', fontWeight: 600 }}>
                  {(auth.user?.displayName ?? 'Admin')[0].toUpperCase()}
                </Avatar>
                <div style={{ textAlign: 'left', lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: token.colorText }}>
                    {auth.user?.displayName ?? 'Quản trị viên'}
                  </div>
                  <div style={{ fontSize: 11, color: token.colorTextSecondary }}>
                    {auth.user?.email ?? 'admin@okz.vn'}
                  </div>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Content Area */}
        <Content style={{ padding: '24px', background: token.colorBgLayout, height: 'calc(100vh - 64px)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
