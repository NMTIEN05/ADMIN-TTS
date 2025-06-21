// Dashbroad.tsx
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  EditOutlined,
  TagOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

const Dashbroad: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') {
      setSelectedKey('dashboard');
    } else if (path.startsWith('/')) {
      setSelectedKey(path.substring(1));
    }
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 60, margin: 16, background: 'rgba(255, 255, 255, 0.3)' }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            setSelectedKey(key);
            navigate(key === 'dashboard' ? '/' : `/${key}`);
          }}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: 'users/list', icon: <UserOutlined />, label: 'Người dùng' },
            { key: 'categories', icon: <AppstoreOutlined />, label: 'Danh mục' },
            { key: 'products', icon: <DatabaseOutlined />, label: 'Sản phẩm' },
            { key: 'authors', icon: <EditOutlined />, label: 'Tác giả' },
            { key: 'coupons', icon: <TagOutlined />, label: 'Mã giảm giá' },
            { key: 'orders', icon: <ShoppingCartOutlined />, label: 'Đơn hàng' },
          ]}
        />
      </Sider>

      <Layout style={{ flex: 1 }}>
        <Content
          style={{
            padding: 16,
            background: '#fff',
            height: '100%',
            width: '100%',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashbroad;