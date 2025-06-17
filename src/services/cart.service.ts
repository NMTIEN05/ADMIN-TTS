import type { Cart } from '@/types/cart.type';
import { axiosInstance } from '@/utils/axios.util';

export const getCarts = async (): Promise<Cart[]> => {
  // Hiện tại backend chỉ có API lấy giỏ hàng theo user_id
  // Cần thêm API admin để lấy tất cả giỏ hàng
  try {
    // Tạm thời trả về mảng rỗng
    return [];
  } catch (error) {
    console.error('Error fetching carts:', error);
    return [];
  }
};

export const getCartById = async (id: string): Promise<Cart> => {
  // Sử dụng API lấy giỏ hàng theo user_id
  const response = await axiosInstance.get(`/cart/${id}`);
  return response.data;
};

export const deleteCart = async (id: string): Promise<void> => {
  // API xóa giỏ hàng chưa được triển khai trong backend
  console.warn('Delete cart API not implemented in backend');
};