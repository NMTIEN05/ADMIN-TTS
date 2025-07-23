import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, DatePicker, Space } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
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

  const { data: booksResponse } = useQuery({
    queryKey: ['books'],
    queryFn: bookService.getAll
  });
  
  // Debug log để xem cấu trúc dữ liệu trả về
  console.log('Books Response Structure:', booksResponse);

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getAll
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll
  });

  // Xử lý response
  let userList = [];
  if (Array.isArray(users)) {
    userList = users;
  } else if (users && users.data && Array.isArray(users.data)) {
    userList = users.data;
  } else if (users && users.results && Array.isArray(users.results)) {
    userList = users.results;
  }
  
  let bookList = [];
  if (Array.isArray(booksResponse)) {
    bookList = booksResponse;
  } else if (booksResponse && Array.isArray(booksResponse.data)) {
    bookList = booksResponse.data;
  } else if (booksResponse && booksResponse.data && Array.isArray(booksResponse.data.data)) {
    bookList = booksResponse.data.data;
  } else if (booksResponse && booksResponse.data && Array.isArray(booksResponse.data.results)) {
    bookList = booksResponse.data.results;
  } else if (booksResponse && booksResponse.data && typeof booksResponse.data === 'object') {
    // Nếu không tìm thấy mảng, log ra để debug
    console.log('Book data structure:', booksResponse.data);
    // Thử lấy tất cả các thuộc tính là mảng
    const possibleArrays = Object.values(booksResponse.data).filter(val => Array.isArray(val));
    if (possibleArrays.length > 0) {
      bookList = possibleArrays[0];
      console.log('Found possible book array:', bookList);
    }
  }
  
  let orderList = [];
  if (Array.isArray(orders)) {
    orderList = orders;
  } else if (orders && Array.isArray(orders.data)) {
    orderList = orders.data;
  } else if (orders && orders.data && Array.isArray(orders.data.data)) {
    orderList = orders.data.data;
  } else if (orders && orders.data && Array.isArray(orders.data.results)) {
    orderList = orders.data.results;
  } else if (orders && orders.results && Array.isArray(orders.results)) {
    orderList = orders.results;
  } else if (orders && typeof orders === 'object') {
    // Nếu không tìm thấy mảng, log ra để debug
    console.log('Order data structure:', orders);
    // Thử lấy tất cả các thuộc tính là mảng
    const possibleArrays = Object.values(orders).filter(val => Array.isArray(val));
    if (possibleArrays.length > 0) {
      orderList = possibleArrays[0];
      console.log('Found possible order array:', orderList);
    }
  }
  console.log('Order list length:', orderList.length, orderList);
  
  let categoryList = [];
  if (Array.isArray(categories)) {
    categoryList = categories;
  } else if (categories && categories.data && Array.isArray(categories.data)) {
    categoryList = categories.data;
  } else if (categories && categories.results && Array.isArray(categories.results)) {
    categoryList = categories.results;
  }

  const totalRevenue = orderList.reduce((sum, order) => {
    // Đảm bảo order và total_amount tồn tại và là số
    const amount = order && typeof order.total_amount === 'number' ? order.total_amount : 0;
    return sum + amount;
  }, 0);
  const [dateRange, setDateRange] = useState<[any, any]>([null, null]);
  
  // Lọc đơn hàng theo ngày
  const filteredOrders = dateRange[0] && dateRange[1] 
    ? orderList.filter(order => {
        const orderDate = new Date(order.createdAt || order.order_date);
        return orderDate >= dateRange[0].startOf('day').toDate() && 
               orderDate <= dateRange[1].endOf('day').toDate();
      })
    : orderList;
    
  const recentOrders = filteredOrders.slice(0, 5);

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
              value={userList.length || 0}
              prefix={<UserOutlined style={{ color: 'white', fontSize: '24px' }} />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />

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
              value={bookList.length || 0}
              prefix={<BookOutlined style={{ color: 'white', fontSize: '24px' }} />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />

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
              value={orderList.length || 0}
              prefix={<ShoppingCartOutlined style={{ color: 'white', fontSize: '24px' }} />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />

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

          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <EyeOutlined style={{ color: '#1890ff' }} />
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>Đơn hàng gần đây</span>
                </div>
                <Space>
                  <DatePicker.RangePicker 
                    locale={locale}
                    onChange={(dates) => setDateRange(dates)}
                    format="DD/MM/YYYY"
                    placeholder={['Từ ngày', 'Đến ngày']}
                  />
                </Space>
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
                  title: 'Ngày đặt',
                  dataIndex: 'createdAt',
                  key: 'createdAt',
                  render: (date: string) => (
                    <span>
                      {new Date(date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
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
                    {categoryList.length || 0}
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
                    {bookList.filter(book => book && book.is_available === true).length || 0}
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
                    {orderList.filter(order => order && order.status === 'pending').length || 0}
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
                    {orderList.filter(order => order && order.status === 'delivered').length || 0}
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