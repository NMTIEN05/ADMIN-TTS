export interface Order {
  _id: string;
  user_id: string;
  order_date: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'confirmed' | 'ready_to_ship' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shipping_address: string;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderInput {
  user_id: string;
  total_amount: number;
  status?: 'pending' | 'processing' | 'confirmed' | 'ready_to_ship' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shipping_address: string;
  payment_method: string;
  payment_status?: 'pending' | 'paid' | 'failed';
  notes?: string;
}

export interface OrderWithDetails extends Order {
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  orderDetails?: OrderDetail[];
}

export interface OrderDetail {
  _id: string;
  order_id: string;
  book_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  book?: {
    _id: string;
    title: string;
    cover_image?: string;
  };
}