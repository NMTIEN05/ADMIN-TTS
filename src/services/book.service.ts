import { apiInstance } from '../utils/axios.util';
import { API_ENDPOINTS } from '../constants';
import type { Book, BookInput, BookWithDetails } from '../types/book.type';

export const bookService = {
  getAll: async (page: number = 0, limit: number = 10): Promise<any> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.BOOKS}?offset=${page}&limit=${limit}`);
    console.log('Books API Response:', response.data);
    
    // Trả về nguyên dữ liệu để component xử lý
    return response.data;
  },

  getById: async (id: string): Promise<BookWithDetails> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.BOOKS}/${id}`);
    return response.data;
  },

  create: async (data: BookInput): Promise<Book> => {
    const response = await apiInstance.post(API_ENDPOINTS.BOOKS_ADD, data);
    return response.data;
  },

  update: async (id: string, data: BookInput): Promise<Book> => {
    console.log('Updating book - ID:', id, 'Data:', data);
    console.log('Update URL:', API_ENDPOINTS.BOOKS_EDIT(id));
    const response = await apiInstance.put(API_ENDPOINTS.BOOKS_EDIT(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiInstance.delete(API_ENDPOINTS.BOOKS_DELETE(id));
  },

  getDeleted: async (): Promise<{ data: BookWithDetails[] }> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.BOOKS}?includeDeleted=true`);
    console.log('Deleted Books API Response:', response.data);
    return response.data;
  },

  restore: async (id: string): Promise<Book> => {
    const response = await apiInstance.patch(`${API_ENDPOINTS.BOOKS}/${id}/restore`);
    return response.data?.data;
  },

  forceDelete: async (id: string): Promise<void> => {
    await apiInstance.delete(`${API_ENDPOINTS.BOOKS}/${id}/force`);
  }
};