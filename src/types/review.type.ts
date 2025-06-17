interface BookReview {
  _id: string;
  user_id: string;
  book_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    email: string;
    fullname?: string;
  };
  book?: {
    title: string;
    image?: string;
  };
}

export type { BookReview };