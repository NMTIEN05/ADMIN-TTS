import { authInstance } from '../utils/axios.util';
import { API_ENDPOINTS } from '../constants';
import type { User, UserInput } from '../types/user.type';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await authInstance.get(API_ENDPOINTS.USERS);
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await authInstance.get(`${API_ENDPOINTS.USERS}/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<UserInput>): Promise<User> => {
    const response = await authInstance.put(`${API_ENDPOINTS.USERS}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await authInstance.delete(`${API_ENDPOINTS.USERS}/${id}`);
  }
};

// Legacy exports for backward compatibility
export const getUsers = userService.getAll;
export const getUserById = userService.getById;
export const updateUser = userService.update;
export const deleteUser = userService.delete;