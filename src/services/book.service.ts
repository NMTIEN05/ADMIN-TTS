import { apiInstance } from '../utils/axios.util';
import { API_ENDPOINTS } from '../constants';
import type { Book, BookInput, BookWithDetails } from '../types/book.type';

export const bookService = {
  getAll: async (): Promise<BookWithDetails[]> => {
    const response = await apiInstance.get(API_ENDPOINTS.BOOKS);
    console.log('Books API Response:', response.data);
    return response.data?.data || [];
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

  getDeleted: async (): Promise<BookWithDetails[]> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.BOOKS}?includeDeleted=true`);
    return response.data?.data || [];
  },

  restore: async (id: string): Promise<Book> => {
    const response = await apiInstance.patch(`/books/restore/${id}`);
    return response.data?.data;
  }
};