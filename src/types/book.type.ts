export interface Book {
  _id: string;
  title: string;
  price: number;
  stock_quantity: number;
  publisher: string;
  publish_year: string; // ISO date string
  description: string;
  category_id: string;
  author_id: string;
  is_available: boolean;
}

export interface BookInput {
  title: string;
  price: number;
  stock_quantity: number;
  publisher: string;
  publish_year: string; // ISO date string
  description: string;
  category_id: string;
  author_id: string;
  is_available?: boolean;
}
