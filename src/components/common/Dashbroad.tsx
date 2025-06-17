// Dashbroad.tsx
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  UploadOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  HeartOutlined,
  CommentOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';

const { Sider, Content } = Layout;

const Dashbroad: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 60, margin: 16, background: 'rgba(255, 255, 255, 0.3)' }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/dashboard/users']}
          onClick={({ key }) => navigate(key)}
          items={[
            { key: '/dashboard/users', icon: <UserOutlined />, label: 'Quản lý người dùng' },
            { key: '/dashboard/uploads', icon: <UploadOutlined />, label: 'Upload ảnh' },
            { key: '/dashboard/categories', icon: <AppstoreOutlined />, label: 'Danh mục' },
            { key: '/dashboard/products', icon: <DatabaseOutlined />, label: 'Sản phẩm' },
            { key: '/dashboard/authors', icon: <UserOutlined />, label: 'Tác giả' },
            { key: '/dashboard/coupons', icon: <ShoppingCartOutlined />, label: 'Mã giảm giá' },
            { key: '/dashboard/orders', icon: <ShoppingOutlined />, label: 'Đơn hàng' },
            { key: '/dashboard/reviews', icon: <CommentOutlined />, label: 'Đánh giá' },
            { key: '/dashboard/carts', icon: <ShoppingCartOutlined />, label: 'Giỏ hàng' },
            { key: '/dashboard/wishlists', icon: <HeartOutlined />, label: 'Yêu thích' },
            { key: '/dashboard/payments', icon: <CreditCardOutlined />, label: 'Thanh toán' },
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
