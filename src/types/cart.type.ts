interface CartItem {
  _id: string;
  cart_id: string;
  book_id: string;
  quantity: number;
  price: number;
  book?: {
    title: string;
    image?: string;
    author?: string;
  };
}

interface Cart {
  _id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  user?: {
    username: string;
    email: string;
  };
}

export type { Cart, CartItem };