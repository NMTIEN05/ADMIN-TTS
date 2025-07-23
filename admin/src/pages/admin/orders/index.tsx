import React, { useState } from 'react';
import { Table, Button, Modal, Space, Popconfirm, message, Tag, Select, Descriptions, Pagination } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../../services/order.service';
import type { OrderWithDetails } from '../../../types/order.type';

const OrderPage: React.FC = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const queryClient = useQueryClient();
  
  // State phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', currentPage - 1, pageSize],
    queryFn: () => orderService.getAll(currentPage - 1, pageSize)
  });

  // Debug log
  console.log('Raw orders response:', orders);
  
  // Xử lý response và cập nhật tổng số item
  console.log('Orders response structure:', orders);
  console.log('Orders data path:', orders?.data);
  console.log('Orders data.data path:', orders?.data?.data);
  
  // Kiểm tra cấu trúc dữ liệu
  let orderList = [];
  if (orders?.data?.data) {
    console.log('Using orders.data.data');
    orderList = orders.data.data;
  } else if (orders?.data) {
    console.log('Using orders.data');
    orderList = orders.data;
  }
  
  React.useEffect(() => {
    if (orders?.data?.totalItems !== undefined) {
      setTotal(orders.data.totalItems);
    } else {
      // Fallback to list length if no totalItems
      setTotal(orderList.length);
    }
  }, [orders, orderList]);
  
  // Hàm xử lý thay đổi trang
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };
  
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

  const returnMutation = useMutation({
    mutationFn: orderService.returnOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      message.success('Hoàn trả đơn hàng thành công!');
    },
    onError: () => {
      message.error('Hoàn trả đơn hàng thất bại!');
    }
  });

  const handleStatusChange = (orderId: string, status: string) => {
    updateStatusMutation.mutate({ id: orderId, status });
  };

  const handleCancelOrder = (orderId: string) => {
    cancelMutation.mutate(orderId);
  };
  
  const handleReturnOrder = (orderId: string) => {
    returnMutation.mutate(orderId);
  };



  const handleViewDetail = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'orange',
      processing: 'gold',
      confirmed: 'blue',
      ready_to_ship: 'cyan',
      shipped: 'purple',
      delivered: 'green',
      cancelled: 'red',
      returned: 'volcano'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      confirmed: 'Đã xác nhận',
      ready_to_ship: 'Sẵn sàng giao',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
      returned: 'Đã hoàn trả'
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
      render: (_: any, record: OrderWithDetails) => {
        const addressParts = record.shipping_address?.split(' - ') || [];
        return addressParts[0] || record.user?.fullname || record.user_id?.fullname || 'N/A';
      },
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
          style={{ width: 160 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          disabled={status === 'cancelled' || status === 'delivered' || status === 'returned'}
        >
          <Select.Option value="pending" disabled={['processing', 'confirmed', 'ready_to_ship', 'shipped', 'delivered'].includes(status)}>Chờ xử lý</Select.Option>
          <Select.Option value="processing" disabled={!['pending'].includes(status)}>Đang xử lý</Select.Option>
          <Select.Option value="confirmed" disabled={!['pending', 'processing'].includes(status)}>Đã xác nhận</Select.Option>
          <Select.Option value="ready_to_ship" disabled={!['confirmed'].includes(status)}>Sẵn sàng giao</Select.Option>
          <Select.Option value="shipped" disabled={!['ready_to_ship'].includes(status)}>Đang giao</Select.Option>
          <Select.Option value="delivered" disabled={!['shipped'].includes(status)}>Đã giao</Select.Option>
          {status === 'delivered' && (
            <Select.Option value="returned">Đã hoàn trả</Select.Option>
          )}
        </Select>
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
          {record.status !== 'cancelled' && record.status !== 'delivered' && record.status !== 'returned' && (
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
          
          {record.status === 'delivered' && (
            <Popconfirm
              title="Xác nhận hoàn trả đơn hàng này?"
              onConfirm={() => handleReturnOrder(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="default" style={{ backgroundColor: '#fa8c16', color: 'white' }}>
                Hoàn trả
              </Button>
            </Popconfirm>
          )}

        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Quản lý đơn hàng</h1>
      </div>

      <>
        <Table 
          columns={columns} 
          dataSource={orderList} 
          rowKey="_id"
          loading={isLoading}
          scroll={{ x: 1200 }}
          pagination={false}
        />
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger
            showTotal={(total) => `Tổng cộng ${total} đơn hàng`}
          />
        </div>
      </>

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
                {(() => {
                  const parts = selectedOrder.shipping_address?.split(' - ') || [];
                  return parts[0] || selectedOrder.user?.fullname || selectedOrder.user_id?.fullname || 'N/A';
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="SĐT">
                {(() => {
                  const parts = selectedOrder.shipping_address?.split(' - ') || [];
                  return parts[1] || 'N/A';
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                {(() => {
                  const parts = selectedOrder.shipping_address?.split(' - ') || [];
                  if (parts.length >= 3) {
                    return (
                      <div>
                        <div><strong>Họ tên:</strong> {parts[0]}</div>
                        <div><strong>SĐT:</strong> {parts[1]}</div>
                        <div><strong>Địa chỉ:</strong> {parts.slice(2).join(' - ')}</div>
                      </div>
                    );
                  }
                  return selectedOrder.shipping_address;
                })()}
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