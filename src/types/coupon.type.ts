export interface Coupon {
  _id: string;
  code: string;
  discount_percent: number;
  min_purchase?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_deleted?: boolean;
  deleted_at?: string;
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