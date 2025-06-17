import type { Payment } from '@/types/payment.type';
import { axiosInstance } from '@/utils/axios.util';

export const getPayments = async (): Promise<Payment[]> => {
  // API payment chưa được triển khai trong backend
  // Cần thêm API admin để lấy tất cả payment
  try {
    // Tạm thời trả về mảng rỗng
    return [];
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};

export const getPaymentById = async (id: string): Promise<Payment> => {
  try {
    // API lấy payment theo id chưa được triển khai
    throw new Error('API not implemented');
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (id: string, status: string): Promise<Payment> => {
  try {
    // API cập nhật trạng thái payment chưa được triển khai
    throw new Error('API not implemented');
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};