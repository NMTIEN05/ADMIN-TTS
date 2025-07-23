import { authInstance } from '../../utils/axios.util';
import { API_ENDPOINTS } from '../../constants';
import type { LoginInput, AuthResponse, User } from '../../types/user.type';

export const authService = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await authInstance.post(API_ENDPOINTS.LOGIN, data);
    return response.data;
  },

  register: async (data: any): Promise<AuthResponse> => {
    const response = await authInstance.post(API_ENDPOINTS.REGISTER, data);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await authInstance.get(API_ENDPOINTS.USERS);
    console.log('Users API Response:', response.data);
    return response.data?.data || [];
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await authInstance.get(`${API_ENDPOINTS.USERS}/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await authInstance.put(`${API_ENDPOINTS.USERS}/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await authInstance.delete(`${API_ENDPOINTS.USERS}/${id}`);
  }
};