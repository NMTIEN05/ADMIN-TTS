import { apiInstance } from '../utils/axios.util';
import { API_ENDPOINTS } from '../constants';
import type { Author, AuthorInput } from '../types/author.type';

export const authorService = {
  getAll: async (page: number = 0, limit: number = 10): Promise<any> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.AUTHORS}?offset=${page}&limit=${limit}`);
    console.log('Authors API Response:', response.data);
    
    // Trả về nguyên dữ liệu để component xử lý
    return response.data;
  },

  getById: async (id: string): Promise<Author> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.AUTHORS}/${id}`);
    return response.data;
  },

  create: async (data: AuthorInput): Promise<Author> => {
    const response = await apiInstance.post(API_ENDPOINTS.AUTHORS_ADD, data);
    return response.data;
  },

  update: async (id: string, data: AuthorInput): Promise<Author> => {
    const response = await apiInstance.put(API_ENDPOINTS.AUTHORS_EDIT(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiInstance.delete(API_ENDPOINTS.AUTHORS_DELETE(id));
  },

  getDeleted: async (): Promise<Author[]> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.AUTHORS}?includeDeleted=true`);
    return response.data?.data || [];
  },

  restore: async (id: string): Promise<Author> => {
    const response = await apiInstance.patch(`${API_ENDPOINTS.AUTHORS}/${id}/restore`);
    return response.data?.data;
  },

  forceDelete: async (id: string): Promise<void> => {
    await apiInstance.delete(`${API_ENDPOINTS.AUTHORS}/${id}/force`);
  }
};