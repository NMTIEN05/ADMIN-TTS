import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { UserOutlined, BookOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
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
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={userList.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={bookList.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={orderList.length}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#cf1322' }}
              formatter={(value) => `${Number(value).toLocaleString('vi-VN')}`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Đơn hàng gần đây" style={{ height: 400 }}>
            <Table
              dataSource={recentOrders}
              columns={orderColumns}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Thống kê nhanh" style={{ height: 400 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Danh mục"
                  value={categoryList.length}
                  style={{ marginBottom: 16 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Sách có sẵn"
                  value={bookList.filter(book => book.is_available).length}
                  style={{ marginBottom: 16 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Đơn hàng chờ xử lý"
                  value={orderList.filter(order => order.status === 'pending').length}
                  style={{ marginBottom: 16 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Đơn hàng đã giao"
                  value={orderList.filter(order => order.status === 'delivered').length}
                  style={{ marginBottom: 16 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;