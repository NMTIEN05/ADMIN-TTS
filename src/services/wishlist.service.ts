import type { WishlistItem } from '@/types/wishlist.type';
import { axiosInstance } from '@/utils/axios.util';

export const getWishlistItems = async (): Promise<WishlistItem[]> => {
  // API wishlist chưa được triển khai trong backend
  // Cần thêm API admin để lấy tất cả wishlist
  try {
    // Tạm thời trả về mảng rỗng
    return [];
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    return [];
  }
};

export const getWishlistByUserId = async (userId: string): Promise<WishlistItem[]> => {
  try {
    // API lấy wishlist theo user_id chưa được triển khai
    return [];
  } catch (error) {
    console.error('Error fetching user wishlist:', error);
    return [];
  }
};

export const deleteWishlistItem = async (id: string): Promise<void> => {
  // API xóa wishlist chưa được triển khai trong backend
  console.warn('Delete wishlist API not implemented in backend');
};