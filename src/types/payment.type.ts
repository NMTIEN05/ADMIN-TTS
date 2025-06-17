interface Payment {
  _id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  created_at: string;
  updated_at: string;
  order?: {
    order_code: string;
    total: number;
  };
}

export type { Payment };