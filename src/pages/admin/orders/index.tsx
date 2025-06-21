import React, { useState } from 'react';
import { Table, Button, Modal, Space, Popconfirm, message, Tag, Select, Descriptions } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../../services/order.service';
import type { OrderWithDetails } from '../../../types/order.type';
import { ORDER_STATUS } from '../../../constants';

const OrderPage: React.FC = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getAll
  });

  // Debug log
  console.log('Raw orders response:', orders);
  
  let orderList = [];
  if (Array.isArray(orders)) {
    orderList = orders;
  } else if (orders && orders.data && Array.isArray(orders.data)) {
    orderList = orders.data;
  } else if (orders && orders.orders && Array.isArray(orders.orders)) {
    orderList = orders.orders;
  }
  
  console.log('Final orderList:', orderList.length);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      message.success('Cập nhật trạng thái đơn hàng thành công!');
    },
    onError: () => {
      message.error('Cập nhật trạng thái đơn hàng thất bại!');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      message.success('Hủy đơn hàng thành công!');
    },
    onError: () => {
      message.error('Hủy đơn hàng thất bại!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: orderService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      message.success('Xóa đơn hàng thành công!');
    },
    onError: () => {
      message.error('Xóa đơn hàng thất bại!');
    }
  });

  const handleStatusChange = (orderId: string, status: string) => {
    updateStatusMutation.mutate({ id: orderId, status });
  };

  const handleCancelOrder = (orderId: string) => {
    cancelMutation.mutate(orderId);
  };

  const handleDeleteOrder = (orderId: string) => {
    deleteMutation.mutate(orderId);
  };

  const handleViewDetail = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      shipped: 'purple',
      delivered: 'green',
      cancelled: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'orange',
      paid: 'green',
      failed: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getPaymentStatusText = (status: string) => {
    const texts = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thanh toán thất bại'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      width: 120,
      render: (id: string) => `#${id.slice(-6)}`,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_: any, record: OrderWithDetails) => 
        record.user?.name || 'N/A',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'order_date',
      key: 'order_date',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: OrderWithDetails) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          disabled={status === 'cancelled' || status === 'delivered'}
        >
          <Select.Option value="pending">Chờ xử lý</Select.Option>
          <Select.Option value="confirmed">Đã xác nhận</Select.Option>
          <Select.Option value="shipped">Đang giao</Select.Option>
          <Select.Option value="delivered">Đã giao</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status: string) => (
        <Tag color={getPaymentStatusColor(status)}>
          {getPaymentStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: OrderWithDetails) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
          {record.status !== 'cancelled' && record.status !== 'delivered' && (
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy đơn hàng này?"
              onConfirm={() => handleCancelOrder(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="default" danger>
                Hủy
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => handleDeleteOrder(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Quản lý đơn hàng</h1>
      </div>

      <Table 
        columns={columns} 
        dataSource={orderList} 
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?._id.slice(-6)}`}
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã đơn hàng">
                #{selectedOrder._id.slice(-6)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {new Date(selectedOrder.order_date).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedOrder.user?.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedOrder.user?.email || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                {selectedOrder.shipping_address}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {selectedOrder.payment_method}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={getPaymentStatusColor(selectedOrder.payment_status)}>
                  {getPaymentStatusText(selectedOrder.payment_status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái đơn hàng">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <strong style={{ color: 'red', fontSize: '16px' }}>
                  {selectedOrder.total_amount.toLocaleString('vi-VN')} VNĐ
                </strong>
              </Descriptions.Item>
              {selectedOrder.notes && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedOrder.notes}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3>Chi tiết sản phẩm</h3>
                <Table
                  dataSource={selectedOrder.orderDetails}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: 'Sản phẩm',
                      key: 'book',
                      render: (_: any, record: any) => record.book?.title || 'N/A',
                    },
                    {
                      title: 'Số lượng',
                      dataIndex: 'quantity',
                      key: 'quantity',
                    },
                    {
                      title: 'Đơn giá',
                      dataIndex: 'unit_price',
                      key: 'unit_price',
                      render: (price: number) => `${price.toLocaleString('vi-VN')} VNĐ`,
                    },
                    {
                      title: 'Thành tiền',
                      dataIndex: 'total_price',
                      key: 'total_price',
                      render: (price: number) => `${price.toLocaleString('vi-VN')} VNĐ`,
                    },
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderPage;