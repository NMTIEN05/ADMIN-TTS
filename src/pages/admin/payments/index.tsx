import { useState, useEffect } from 'react';
import { Table, Button, Space, message, Tag, Select, Alert } from 'antd';
import { getPayments, updatePaymentStatus } from '@/services/payment.service';
import type { Payment } from '@/types/payment.type';

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPayments();
      setPayments(Array.isArray(data) ? data : []);
      setError('API quản lý thanh toán chưa được triển khai trong backend');
    } catch (error) {
      message.error('Không thể tải danh sách thanh toán');
      setPayments([]);
      setError('API quản lý thanh toán chưa được triển khai trong backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setStatusLoading(prev => ({ ...prev, [id]: true }));
    try {
      await updatePaymentStatus(id, status);
      message.success('Cập nhật trạng thái thanh toán thành công');
      fetchPayments();
    } catch (error) {
      message.error('Không thể cập nhật trạng thái thanh toán: API chưa được triển khai');
    } finally {
      setStatusLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'failed':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      default:
        return 'Không xác định';
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: ['order', 'order_code'],
      key: 'order_code',
      render: (text: string, record: Payment) => record.order?.order_code || 'N/A',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount?.toLocaleString() || 0} đ`,
    },
    {
      title: 'Phương thức',
      dataIndex: 'payment_method',
      key: 'payment_method',
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'transaction_id',
      key: 'transaction_id',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
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
      render: (_: any, record: Payment) => (
        <Space size="middle">
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record._id, value)}
            loading={statusLoading[record._id]}
            disabled={record.status === 'completed'}
          >
            <Select.Option value="pending">Đang xử lý</Select.Option>
            <Select.Option value="completed">Hoàn thành</Select.Option>
            <Select.Option value="failed">Thất bại</Select.Option>
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Thanh toán</h2>
      
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
        dataSource={payments}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default PaymentsPage;