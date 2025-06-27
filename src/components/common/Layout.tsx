import { Layout, Menu, Avatar, Dropdown, Button, Badge } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  EditOutlined,
  TagOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  BookOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logout } from '../../utils/logout';
import Logo from '../common/Logo';

const { Sider, Content, Header } = Layout;

const Dashboard: React.FC = () => {
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

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
      >
        {/* Logo */}
        <Logo collapsed={collapsed} />
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            setSelectedKey(key);
            navigate(key === 'dashboard' ? '/' : `/${key}`);
          }}
          style={{ 
            background: 'transparent',
            border: 'none'
          }}
          items={[
            { 
              key: 'dashboard', 
              icon: <DashboardOutlined style={{ fontSize: '16px' }} />, 
              label: 'Dashboard',
              style: { margin: '4px 0' }
            },
            { 
              key: 'users/list', 
              icon: <UserOutlined style={{ fontSize: '16px' }} />, 
              label: 'Người dùng',
              style: { margin: '4px 0' }
            },
            { 
              key: 'categories', 
              icon: <AppstoreOutlined style={{ fontSize: '16px' }} />, 
              label: 'Danh mục',
              style: { margin: '4px 0' }
            },
            { 
              key: 'products', 
              icon: <DatabaseOutlined style={{ fontSize: '16px' }} />, 
              label: 'Sản phẩm',
              style: { margin: '4px 0' }
            },
            { 
              key: 'authors', 
              icon: <EditOutlined style={{ fontSize: '16px' }} />, 
              label: 'Tác giả',
              style: { margin: '4px 0' }
            },
            { 
              key: 'coupons', 
              icon: <TagOutlined style={{ fontSize: '16px' }} />, 
              label: 'Mã giảm giá',
              style: { margin: '4px 0' }
            },
            { 
              key: 'orders', 
              icon: <ShoppingCartOutlined style={{ fontSize: '16px' }} />, 
              label: 'Đơn hàng',
              style: { margin: '4px 0' }
            },
            { 
              key: 'flashsales', 
              icon: <BookOutlined style={{ fontSize: '16px' }} />, 
              label: 'Flash Sales',
              style: { margin: '4px 0' }
            },
          ]}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
              }}
            />
            <h2 style={{ 
              margin: '0 0 0 16px', 
              color: '#1890ff',
              fontWeight: '600'
            }}>
              Quản trị hệ thống
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Badge count={5} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined style={{ fontSize: '18px' }} />}
                style={{ 
                  width: 40, 
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '8px',
                transition: 'background-color 0.3s'
              }}>
                <Avatar 
                  size={36} 
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  }}
                >
                  Admin
                </Avatar>
                <span style={{ 
                  marginLeft: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  Administrator
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#f5f5f5',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)',
            overflow: 'auto',
          }}
        >
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minHeight: '100%'
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;