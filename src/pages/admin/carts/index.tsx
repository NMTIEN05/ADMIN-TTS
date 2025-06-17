import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Alert } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getCarts, getCartById, deleteCart } from '@/services/cart.service';
import type { Cart, CartItem } from '@/types/cart.type';

const CartsPage = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCarts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCarts();
      setCarts(Array.isArray(data) ? data : []);
      setError('API quản lý giỏ hàng chưa được triển khai trong backend');
    } catch (error) {
      message.error('Không thể tải danh sách giỏ hàng');
      setCarts([]);
      setError('API quản lý giỏ hàng chưa được triển khai trong backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteCart(id);
      message.success('Xóa giỏ hàng thành công');
      fetchCarts();
    } catch (error) {
      message.error('Không thể xóa giỏ hàng: API chưa được triển khai');
    }
  };

  const showCartDetail = async (cartId: string) => {
    setDetailLoading(true);
    try {
      const cart = await getCartById(cartId);
      setSelectedCart(cart);
      setCartItems(cart.items || []);
      setModalVisible(true);
    } catch (error) {
      message.error('Không thể tải chi tiết giỏ hàng: API chưa được triển khai');
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: ['user', 'username'],
      key: 'username',
      render: (text: string, record: Cart) => record.user?.username || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (text: string, record: Cart) => record.user?.email || 'N/A',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (amount: number) => `${amount?.toLocaleString() || 0} đ`,
    },
    {
      title: 'Số lượng sản phẩm',
      key: 'itemCount',
      render: (_, record: Cart) => record.items?.length || 0,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Cart) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => showCartDetail(record._id)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa giỏ hàng này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const itemColumns = [
    {
      title: 'Sách',
      dataIndex: ['book', 'title'],
      key: 'book',
      render: (text: string, record: CartItem) => record.book?.title || 'N/A',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price?.toLocaleString() || 0} đ`,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, record: CartItem) => `${(record.price * record.quantity)?.toLocaleString() || 0} đ`,
    },
  ];

  return (
    <div>
      <h2>Quản lý Giỏ hàng</h2>
      
      {error && (
        <Alert
          message="Thông báo"
          description={error}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      <Table
        columns={columns}
        dataSource={carts}
        rowKey="_id"
        loading={loading}
      />
      
      <Modal
        title="Chi tiết giỏ hàng"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCart && (
          <>
            <p><strong>Người dùng:</strong> {selectedCart.user?.username}</p>
            <p><strong>Tổng tiền:</strong> {selectedCart.total?.toLocaleString() || 0} đ</p>
            
            <Table
              columns={itemColumns}
              dataSource={cartItems}
              rowKey="_id"
              loading={detailLoading}
              pagination={false}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default CartsPage;