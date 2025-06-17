export interface Coupon {
  _id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number; // Đổi tên trường theo backend
  min_purchase: number; // Đổi tên trường theo backend
  start_date: string;
  end_date: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponInput {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number; // Đổi tên trường theo backend
  min_purchase: number; // Đổi tên trường theo backend
  start_date: string;
  end_date: string;
  is_active?: boolean;
}