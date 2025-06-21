import { apiInstance } from '../utils/axios.util';

export interface ProductVariant {
  _id: string;
  book_id: string;
  format: 'hardcover' | 'paperback' | 'pdf';
  price: number;
  stock_quantity: number;
  pages?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  file_size?: number;
  file_format?: 'PDF' | 'EPUB' | 'MOBI';
  is_available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariantInput {
  format: 'hardcover' | 'paperback' | 'pdf';
  price: number;
  stock_quantity: number;
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

export const productVariantService = {
  getByBookId: async (bookId: string): Promise<ProductVariant[]> => {
    const response = await apiInstance.get(`/variants/book/${bookId}`);
    return response.data?.data || [];
  },

  create: async (bookId: string, data: ProductVariantInput): Promise<ProductVariant> => {
    const response = await apiInstance.post(`/variants/book/${bookId}`, data);
    return response.data.data;
  },

  update: async (id: string, data: ProductVariantInput): Promise<ProductVariant> => {
    const response = await apiInstance.put(`/variants/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiInstance.delete(`/variants/${id}`);
  }
};