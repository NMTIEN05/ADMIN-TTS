interface WishlistItem {
  _id: string;
  user_id: string;
  book_id: string;
  created_at: string;
  book?: {
    title: string;
    image?: string;
    price: number;
    author?: string;
  };
  user?: {
    username: string;
    email: string;
  };
}

export type { WishlistItem };