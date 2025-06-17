export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderDetailItem {
  book_id: {
    _id: string;
    title: string;
    price: number;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderDetail {
  _id: string;
  order_id: string;
  book_id: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderCoupon {
  coupon_id: {
    _id: string;
    code: string;
    discount_amount: number;
  };
}

export interface Order {
  _id: string;
  user_id: string;
  cart_id: string;
  total_amount: number;
  status: OrderStatus;
  order_date: string;
  shipping_address: string;
  payment_method: string;
  shipping_fee: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFullDetail extends Order {
  details: OrderDetailItem[];
  coupons: OrderCoupon[];
}

export interface OrderInput {
  user_id: string;
  cart_id: string;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  shipping_fee?: number;
  tax?: number;
  details: {
    book_id: string;
    quantity: number;
    price: number;
  }[];
  coupons?: string[];
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "orange",
  processing: "blue",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};
