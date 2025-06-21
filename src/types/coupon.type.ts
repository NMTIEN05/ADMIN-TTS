export interface Coupon {
  _id: string;
  code: string;
  discount_percent: number;
  min_purchase?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CouponInput {
  code: string;
  discount_percent: number;
  min_purchase?: number;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}