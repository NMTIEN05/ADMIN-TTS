import { apiInstance } from '../utils/axios.util';
import { API_ENDPOINTS } from '../constants';
import type { Category, CategoryInput } from '../types/category.type';

export const categoryService = {
  getAll: async (page: number = 0, limit: number = 7): Promise<any> => {
    try {
      const response = await apiInstance.get(`${API_ENDPOINTS.CATEGORIES}?offset=${page}&limit=${limit}`);
      console.log('Categories API Response:', response);
      console.log('Categories API Response Data:', response.data);
      
      // Backend trả về cấu trúc { data: { data: [...], offset: number, limit: number, totalItems: number, hasMore: boolean }, message: "..." }
      
      if (response.data && response.data.data) {
        // Trả về toàn bộ dữ liệu phân trang
        return response.data.data;
      }
      
      console.log('No valid data structure found, returning empty object');
      return { data: [], offset: 0, limit, totalItems: 0, hasMore: false };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: [], offset: 0, limit, totalItems: 0, hasMore: false };
    }
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.CATEGORIES}/${id}`);
    return response.data;
  },

  create: async (data: CategoryInput): Promise<Category> => {
    const response = await apiInstance.post(API_ENDPOINTS.CATEGORIES_ADD, data);
    return response.data;
  },

  update: async (id: string, data: CategoryInput): Promise<Category> => {
    const response = await apiInstance.put(API_ENDPOINTS.CATEGORIES_EDIT(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiInstance.delete(API_ENDPOINTS.CATEGORIES_DELETE(id));
  },

  getDeleted: async (): Promise<Category[]> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.CATEGORIES}?includeDeleted=true`);
    return response.data?.data || [];
  },

  restore: async (id: string): Promise<Category> => {
    const response = await apiInstance.patch(`${API_ENDPOINTS.CATEGORIES}/${id}/restore`);
    return response.data?.data;
  },

  forceDelete: async (id: string): Promise<void> => {
    await apiInstance.delete(`${API_ENDPOINTS.CATEGORIES}/${id}/force`);
  }
};

// Legacy exports for backward compatibility
export const getCategories = categoryService.getAll;
export const getCategoryById = categoryService.getById;
export const addCategory = categoryService.create;
export const updateCategory = categoryService.update;
export const deleteCategory = categoryService.delete;
export const getDeletedCategories = categoryService.getDeleted;
export const restoreCategory = categoryService.restore;