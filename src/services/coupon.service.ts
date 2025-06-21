import { apiInstance } from '../utils/axios.util';
import { API_ENDPOINTS } from '../constants';
import type { Coupon, CouponInput } from '../types/coupon.type';

export const couponService = {
  getAll: async (): Promise<Coupon[]> => {
    const response = await apiInstance.get(API_ENDPOINTS.COUPONS);
    console.log('Coupons API Response:', response.data);
    return response.data?.data || [];
  },

  getById: async (id: string): Promise<Coupon> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.COUPONS}/${id}`);
    return response.data;
  },

  create: async (data: CouponInput): Promise<Coupon> => {
    const response = await apiInstance.post(API_ENDPOINTS.COUPONS_ADD, data);
    return response.data;
  },

  update: async (id: string, data: CouponInput): Promise<Coupon> => {
    const response = await apiInstance.put(API_ENDPOINTS.COUPONS_EDIT(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiInstance.delete(API_ENDPOINTS.COUPONS_DELETE(id));
  },

  toggleStatus: async (id: string): Promise<Coupon> => {
    const response = await apiInstance.patch(API_ENDPOINTS.COUPONS_TOGGLE(id));
    return response.data;
  }
};