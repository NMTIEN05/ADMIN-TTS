import { apiInstance } from '../utils/axios.util';
import { API_ENDPOINTS } from '../constants';
import type { Category, CategoryInput } from '../types/category.type';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiInstance.get(API_ENDPOINTS.CATEGORIES);
    console.log('Categories API Response:', response.data);
    return response.data?.data || [];
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
  }
};

// Legacy exports for backward compatibility
export const getCategories = categoryService.getAll;
export const getCategoryById = categoryService.getById;
export const addCategory = categoryService.create;
export const updateCategory = categoryService.update;
export const deleteCategory = categoryService.delete;