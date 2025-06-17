import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Rate, Alert } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getReviews, deleteReview } from '@/services/review.service';
import type { BookReview } from '@/types/review.type';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReviews();
      setReviews(Array.isArray(data) ? data : []);
      if (data.length === 0) {
        setError('API chưa được triển khai hoặc không có dữ liệu');
      }
    } catch (error) {
      message.error('Không thể tải danh sách đánh giá');
      setReviews([]);
      setError('API chưa được triển khai hoặc có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      message.success('Xóa đánh giá thành công');
      fetchReviews();
    } catch (error) {
      message.error('Không thể xóa đánh giá: API chưa được triển khai');
    }
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: ['user', 'username'],
      key: 'username',
      render: (text: string, record: BookReview) => record.user?.username || 'N/A',
    },
    {
      title: 'Sách',
      dataIndex: ['book', 'title'],
      key: 'book',
      render: (text: string, record: BookReview) => record.book?.title || 'N/A',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Bình luận',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: BookReview) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đánh giá này?"
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
      <h2>Quản lý Đánh giá</h2>
      
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
        dataSource={reviews}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default ReviewsPage;