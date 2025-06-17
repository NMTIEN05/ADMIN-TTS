import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getCoupons, deleteCoupon } from '@/services/coupon.service';
import type { Coupon } from '@/types/coupon.type';
import CouponForm from '@/components/admin/CouponForm';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | undefined>(undefined);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      // Đảm bảo data là một mảng
      setCoupons(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error('Không thể tải danh sách mã giảm giá');
      setCoupons([]); // Fallback về mảng rỗng nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id);
      message.success('Xóa mã giảm giá thành công');
      fetchCoupons();
    } catch (error) {
      message.error('Không thể xóa mã giảm giá');
    }
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    fetchCoupons();
  };

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Loại',
      dataIndex: 'discount_type',
      key: 'discount_type',
      render: (type: string) => type === 'percentage' ? 'Phần trăm (%)' : 'Số tiền cố định',
    },
    {
      title: 'Giá trị',
      dataIndex: 'discount_value',
      key: 'discount_value',
      render: (amount: number, record: Coupon) => 
        amount ? (record.discount_type === 'percentage' ? `${amount}%` : `${amount.toLocaleString()} đ`) : '0',
    },
    {
      title: 'Đơn hàng tối thiểu',
      dataIndex: 'min_purchase',
      key: 'min_purchase',
      render: (amount: number) => amount ? `${amount.toLocaleString()} đ` : '0 đ',
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record: Coupon) => (
        <>
          {new Date(record.start_date).toLocaleDateString()} - {new Date(record.end_date).toLocaleDateString()}
        </>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record: Coupon) => {
        const now = new Date();
        const startDate = new Date(record.start_date);
        const endDate = new Date(record.end_date);
        const isActive = record.is_active;
        const isExpired = now > endDate;
        const isNotStarted = now < startDate;

        if (!isActive) {
          return <Tag color="default">Không kích hoạt</Tag>;
        } else if (isExpired) {
          return <Tag color="red">Hết hạn</Tag>;
        } else if (isNotStarted) {
          return <Tag color="blue">Chưa bắt đầu</Tag>;
        } else {
          return <Tag color="green">Đang hoạt động</Tag>;
        }
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Coupon) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setSelectedCoupon(record);
              setModalVisible(true);
            }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mã giảm giá này?"
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
      <h2>Quản lý Mã giảm giá</h2>
      
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setSelectedCoupon(undefined);
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Thêm mã giảm giá
      </Button>
      
      <Table
        columns={columns}
        dataSource={Array.isArray(coupons) ? coupons : []}
        rowKey="_id"
        loading={loading}
      />
      
      <Modal
        title={selectedCoupon ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <CouponForm
          coupon={selectedCoupon}
          onSuccess={handleModalSuccess}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default CouponsPage;