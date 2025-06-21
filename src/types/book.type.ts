export interface Book {
  _id: string;
  category_id: string;
  author_id: string;
  title: string;
  publisher: string;
  publish_year: string;
  description: string;
  price: number;
  stock_quantity: number;
  cover_image?: string;
  is_available: boolean;
  format: 'hardcover' | 'paperback' | 'pdf';
  // Thông tin riêng cho format vật lý
  pages?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  // Thông tin riêng cho PDF
  file_size?: number;
  file_format?: 'PDF' | 'EPUB' | 'MOBI';
  createdAt?: string;
  updatedAt?: string;
}

export interface BookInput {
  category_id: string;
  author_id: string;
  title: string;
  publisher: string;
  publish_year: string;
  description: string;
  price: number;
  stock_quantity: number;
  cover_image?: string;
  is_available?: boolean;
  format: 'hardcover' | 'paperback' | 'pdf';
  // Thông tin riêng
  pages?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  file_size?: number;
  file_format?: 'PDF' | 'EPUB' | 'MOBI';
}

export interface BookWithDetails extends Book {
  category?: {
    _id: string;
    name: string;
  };
  author?: {
    _id: string;
    name: string;
  };
}