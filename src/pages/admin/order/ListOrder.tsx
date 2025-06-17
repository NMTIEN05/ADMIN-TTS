import { useEffect, useState } from "react";
import { Table, Button, Tag, Popconfirm, message, Space } from "antd";
import { getOrders, deleteOrder, cancelOrder } from "@/services/order.service";
import type { Order } from "@/types/order.type";
import { ORDER_STATUS_COLORS } from "@/types/order.type";
import { useNavigate } from "react-router-dom";

const STATUS_VN: Record<string, string> = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipped: "Đã gửi hàng",
  delivered: "Đã giao",
  cancelled: "Đã huỷ",
};

export default function ListOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders({});
      // Đảm bảo luôn là mảng
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      message.error("Lỗi khi tải danh sách đơn hàng");
      setOrders([]); // fallback về mảng rỗng nếu lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    setActionId(id);
    try {
      await deleteOrder(id);
      message.success("Xoá đơn hàng thành công");
      fetchOrders();
    } catch {
      message.error("Xoá thất bại");
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (id: string) => {
    setActionId(id);
    try {
      await cancelOrder(id);
      message.success("Đơn hàng đã được huỷ");
      fetchOrders();
    } catch {
      message.error("Huỷ đơn hàng thất bại");
    } finally {
      setActionId(null);
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
    },
    {
      title: "Ngày đặt",
      dataIndex: "order_date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      render: (val: number) => `${val.toLocaleString()}₫`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={ORDER_STATUS_COLORS[status] || "default"}>
          {STATUS_VN[status] || status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_: any, record: Order) => (
        <Space>
          <Button onClick={() => navigate(`/dashboard/orders/${record._id}`)} size="small">
            Chi tiết
          </Button>
          {(record.status !== "cancelled" && record.status !== "delivered") && (
            <>
              <Popconfirm
                title="Xoá đơn hàng?"
                onConfirm={() => handleDelete(record._id)}
              >
                <Button
                  danger
                  size="small"
                  loading={actionId === record._id && loading}
                >
                  Xoá
                </Button>
              </Popconfirm>
              {record.status === "pending" && (
                <Popconfirm
                  title="Huỷ đơn này?"
                  onConfirm={() => handleCancel(record._id)}
                >
                  <Button
                    size="small"
                    loading={actionId === record._id && loading}
                  >
                    Huỷ
                  </Button>
                </Popconfirm>
              )}
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={orders || []}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
}
