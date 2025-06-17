import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Alert } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getWishlistItems, deleteWishlistItem } from '@/services/wishlist.service';
import type { WishlistItem } from '@/types/wishlist.type';

const WishlistsPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlistItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWishlistItems();
      setWishlistItems(Array.isArray(data) ? data : []);
      setError('API quản lý danh sách yêu thích chưa được triển khai trong backend');
    } catch (error) {
      message.error('Không thể tải danh sách yêu thích');
      setWishlistItems([]);
      setError('API quản lý danh sách yêu thích chưa được triển khai trong backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteWishlistItem(id);
      message.success('Xóa mục yêu thích thành công');
      fetchWishlistItems();
    } catch (error) {
      message.error('Không thể xóa mục yêu thích: API chưa được triển khai');
    }
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: ['user', 'username'],
      key: 'username',
      render: (text: string, record: WishlistItem) => record.user?.username || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (text: string, record: WishlistItem) => record.user?.email || 'N/A',
    },
    {
      title: 'Sách',
      dataIndex: ['book', 'title'],
      key: 'book',
      render: (text: string, record: WishlistItem) => record.book?.title || 'N/A',
    },
    {
      title: 'Giá',
      dataIndex: ['book', 'price'],
      key: 'price',
      render: (price: number, record: WishlistItem) => 
        record.book?.price ? `${record.book.price.toLocaleString()} đ` : 'N/A',
    },
    {
      title: 'Ngày thêm',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: WishlistItem) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục yêu thích này?"
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

  return (
    <div>
      <h2>Quản lý Danh sách yêu thích</h2>
      
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
        dataSource={wishlistItems}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default WishlistsPage;