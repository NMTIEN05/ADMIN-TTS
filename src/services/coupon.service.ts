import { apiInstance } from '../utils/axios.util';
import { API_ENDPOINTS } from '../constants';
import type { Coupon, CouponInput } from '../types/coupon.type';

export const couponService = {
  getAll: async (): Promise<Coupon[]> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.COUPONS}?includeDeleted=false`);
    return response.data?.data || [];
  },

  getById: async (id: string): Promise<Coupon> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.COUPONS}/${id}`);
    return response.data?.data;
  },

  create: async (data: CouponInput): Promise<Coupon> => {
    const response = await apiInstance.post(API_ENDPOINTS.COUPONS_ADD, data);
    return response.data?.data;
  },

  update: async (id: string, data: CouponInput): Promise<Coupon> => {
    const response = await apiInstance.put(API_ENDPOINTS.COUPONS_EDIT(id), data);
    return response.data?.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiInstance.delete(API_ENDPOINTS.COUPONS_DELETE(id));
  },

  restore: async (id: string): Promise<Coupon> => {
    const response = await apiInstance.patch(`/coupons/restore/${id}`);
    return response.data?.data;
  },

  getDeleted: async (): Promise<Coupon[]> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.COUPONS}?includeDeleted=true`);
    return response.data?.data || [];
  },

  toggleStatus: async (id: string): Promise<Coupon> => {
    const response = await apiInstance.patch(API_ENDPOINTS.COUPONS_TOGGLE(id));
    return response.data?.data;
  }
};