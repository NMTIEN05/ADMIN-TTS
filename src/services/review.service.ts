import type { BookReview } from '@/types/review.type';
import { axiosInstance } from '@/utils/axios.util';

export const getReviews = async (): Promise<BookReview[]> => {
  // Sử dụng endpoint có sẵn để lấy tất cả đánh giá
  // Nếu không có endpoint admin/reviews, có thể cần thêm vào backend
  try {
    const response = await axiosInstance.get('/book-reviews');
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const getReviewById = async (id: string): Promise<BookReview> => {
  const response = await axiosInstance.get(`/book-review/${id}`);
  return response.data;
};

export const getReviewsByBook = async (bookId: string): Promise<BookReview[]> => {
  const response = await axiosInstance.get(`/book-review/${bookId}`);
  return response.data;
};

export const updateReview = async (id: string, reviewData: Partial<BookReview>): Promise<BookReview> => {
  const response = await axiosInstance.put(`/book-reviews/${id}`, reviewData);
  return response.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/book-reviews/${id}`);
};