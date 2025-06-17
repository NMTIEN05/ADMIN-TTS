import type { User } from '@/types/user.type';
import { axiosInstance } from '@/utils/axios.util';

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    // API lấy user theo id chưa được triển khai
    const users = await getUsers();
    const user = users.find(u => u._id === id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  try {
    // API tạo user chưa được triển khai trong admin routes
    throw new Error('API not implemented');
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    // API cập nhật user chưa được triển khai trong admin routes
    throw new Error('API not implemented');
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    // API xóa user chưa được triển khai trong admin routes
    throw new Error('API not implemented');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};