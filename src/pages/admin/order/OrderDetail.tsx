import { useEffect, useState } from "react";
import { Descriptions, Table, Tag, message } from "antd";
import { useParams } from "react-router-dom";
import { getOrderById } from "@/services/order.service";
import { ORDER_STATUS_COLORS, type OrderFullDetail } from "@/types/order.type";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderFullDetail | null>(null);

  useEffect(() => {
    if (id) {
      getOrderById(id)
        .then((data) => setOrder(data))
        .catch(() => message.error("Không thể tải chi tiết đơn hàng"));
    }
  }, [id]);

  if (!order) return null;

  return (
    <>
      <Descriptions title={`Chi tiết đơn hàng: ${order._id}`} bordered column={2}>
        <Descriptions.Item label="Trạng thái">
          <Tag color={ORDER_STATUS_COLORS[order.status] || "default"}>{order.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt">{new Date(order.order_date).toLocaleDateString()}</Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">{order.total_amount.toLocaleString()}₫</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ giao">{order.shipping_address}</Descriptions.Item>
        <Descriptions.Item label="Thanh toán">{order.payment_method}</Descriptions.Item>
        <Descriptions.Item label="Phí vận chuyển">{order.shipping_fee.toLocaleString()}₫</Descriptions.Item>
        <Descriptions.Item label="Thuế">{order.tax.toLocaleString()}₫</Descriptions.Item>
        {order.coupons && order.coupons.length > 0 && (
          <Descriptions.Item label="Mã giảm giá">
            {order.coupons.map((c) => (
              <Tag color="green" key={c.coupon_id._id}>
                {c.coupon_id.code} (-{c.coupon_id.discount_amount.toLocaleString()}₫)
              </Tag>
            ))}
          </Descriptions.Item>
        )}
      </Descriptions>

      <h3 className="mt-4">Sản phẩm:</h3>
      <Table
        dataSource={order.details}
        rowKey={(r) => r.book_id._id}
        pagination={false}
        columns={[
          { title: "Tên sách", dataIndex: ["book_id", "title"] },
          { title: "Số lượng", dataIndex: "quantity" },
          { title: "Giá", dataIndex: "price", render: (val) => `${val.toLocaleString()}₫` },
          { title: "Thành tiền", dataIndex: "subtotal", render: (val) => `${val.toLocaleString()}₫` },
        ]}
      />
    </>
  );
}
