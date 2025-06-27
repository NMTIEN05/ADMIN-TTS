import React from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Tag } from 'antd';
import { UserOutlined, BookOutlined, ShoppingCartOutlined, DollarOutlined, BarChartOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../../services/user.service';
import { bookService } from '../../../services/book.service';
import { orderService } from '../../../services/order.service';
import { categoryService } from '../../../services/category.service';

const DashboardPage: React.FC = () => {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  });

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: bookService.getAll
  });

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getAll
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll
  });

  // Debug log
  console.log('Dashboard - Raw responses:', { users, books, orders, categories });
  
  // Xử lý response
  let userList = [];
  if (Array.isArray(users)) {
    userList = users;
  } else if (users && users.data && Array.isArray(users.data)) {
    userList = users.data;
  }
  
  let bookList = [];
  if (Array.isArray(books)) {
    bookList = books;
  } else if (books && books.data && Array.isArray(books.data)) {
    bookList = books.data;
  }
  
  let orderList = [];
  if (Array.isArray(orders)) {
    orderList = orders;
  } else if (orders && orders.data && Array.isArray(orders.data)) {
    orderList = orders.data;
  }
  
  let categoryList = [];
  if (Array.isArray(categories)) {
    categoryList = categories;
  } else if (categories && categories.data && Array.isArray(categories.data)) {
    categoryList = categories.data;
  }
  
  console.log('Dashboard - Final lists:', { userList: userList.length, bookList: bookList.length, orderList: orderList.length, categoryList: categoryList.length });

  const totalRevenue = orderList.reduce((sum, order) => sum + order.total_amount, 0);
  const recentOrders = orderList.slice(0, 5);

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      render: (id: string) => `#${id.slice(-6)}`,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_: any, record: any) => record.user_id?.fullname || 'N/A',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: 'Chờ xử lý',
          confirmed: 'Đã xác nhận',
          shipped: 'Đang giao',
          delivered: 'Đã giao',
          cancelled: 'Đã hủy'
        };
        return statusMap[status as keyof typeof statusMap] || status;
      },
    },
  ];

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div style={{ 
        marginBottom: 32,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '24px',
        color: 'white'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '28px', 
          fontWeight: '600',
          color: 'white'
        }}>
          Dashboard Tổng Quan
        </h1>
        <p style={{ 
          margin: '8px 0 0 0', 
          opacity: 0.9,
          fontSize: '16px'
        }}>
          Chào mừng bạn đến với hệ thống quản trị SBOOK
        </p>
      </div>
      
      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="stats-card"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Tổng người dùng</span>}
              value={userList.length}
              prefix={<UserOutlined style={{ color: 'white', fontSize: '24px' }} />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />
            <div style={{ marginTop: '12px' }}>
              <Progress 
                percent={75} 
                showInfo={false} 
                strokeColor="rgba(255,255,255,0.3)"
                trailColor="rgba(255,255,255,0.1)"
              />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>+12% so với tháng trước</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="stats-card"
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(240, 147, 251, 0.3)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Tổng sản phẩm</span>}
              value={bookList.length}
              prefix={<BookOutlined style={{ color: 'white', fontSize: '24px' }} />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />
            <div style={{ marginTop: '12px' }}>
              <Progress 
                percent={85} 
                showInfo={false} 
                strokeColor="rgba(255,255,255,0.3)"
                trailColor="rgba(255,255,255,0.1)"
              />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>+8% so với tháng trước</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="stats-card"
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Tổng đơn hàng</span>}
              value={orderList.length}
              prefix={<ShoppingCartOutlined style={{ color: 'white', fontSize: '24px' }} />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />
            <div style={{ marginTop: '12px' }}>
              <Progress 
                percent={92} 
                showInfo={false} 
                strokeColor="rgba(255,255,255,0.3)"
                trailColor="rgba(255,255,255,0.1)"
              />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>+25% so với tháng trước</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="stats-card"
            style={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(250, 112, 154, 0.3)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Tổng doanh thu</span>}
              value={totalRevenue}
              prefix={<DollarOutlined style={{ color: 'white', fontSize: '24px' }} />}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>VNĐ</span>}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              formatter={(value) => `${Number(value).toLocaleString('vi-VN')}`}
            />
            <div style={{ marginTop: '12px' }}>
              <Progress 
                percent={68} 
                showInfo={false} 
                strokeColor="rgba(255,255,255,0.3)"
                trailColor="rgba(255,255,255,0.1)"
              />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>+18% so với tháng trước</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EyeOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontSize: '18px', fontWeight: '600' }}>Đơn hàng gần đây</span>
              </div>
            }
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              border: 'none'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Table
              dataSource={recentOrders}
              columns={[
                {
                  title: 'Mã đơn hàng',
                  dataIndex: '_id',
                  key: '_id',
                  render: (id: string) => (
                    <Tag color="blue" style={{ fontWeight: '500' }}>
                      #{id.slice(-6)}
                    </Tag>
                  ),
                },
                {
                  title: 'Khách hàng',
                  key: 'customer',
                  render: (_: any, record: any) => (
                    <span style={{ fontWeight: '500' }}>
                      {record.user_id?.fullname || 'N/A'}
                    </span>
                  ),
                },
                {
                  title: 'Tổng tiền',
                  dataIndex: 'total_amount',
                  key: 'total_amount',
                  render: (amount: number) => (
                    <span style={{ fontWeight: '600', color: '#52c41a' }}>
                      {amount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  ),
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => {
                    const statusConfig = {
                      pending: { color: 'orange', text: 'Chờ xử lý' },
                      confirmed: { color: 'blue', text: 'Đã xác nhận' },
                      shipped: { color: 'purple', text: 'Đang giao' },
                      delivered: { color: 'green', text: 'Đã giao' },
                      cancelled: { color: 'red', text: 'Đã hủy' }
                    };
                    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
                    return <Tag color={config.color}>{config.text}</Tag>;
                  },
                },
              ]}
              rowKey="_id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={10}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChartOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontSize: '18px', fontWeight: '600' }}>Thống kê nhanh</span>
              </div>
            }
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              border: 'none'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Row gutter={[16, 24]}>
              <Col span={12}>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '8px',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {categoryList.length}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Danh mục</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '8px',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {bookList.filter(book => book.is_available).length}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Sách có sẵn</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: '8px',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {orderList.filter(order => order.status === 'pending').length}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Chờ xử lý</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  borderRadius: '8px',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {orderList.filter(order => order.status === 'delivered').length}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Đã giao hàng</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;