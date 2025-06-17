import axios from "axios";
import type { Coupon, CouponInput } from "@/types/coupon.type";

const API_URL = "http://localhost:8888/api/coupons";

export const getCoupons = async () => {
  try {
    const res = await axios.get(API_URL);
    // Kiểm tra cấu trúc dữ liệu và đảm bảo trả về mảng
    const data = res.data?.data?.data || res.data?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
};

export const getCouponById = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data.data;
};

export const createCoupon = async (data: CouponInput) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data.data;
};

export const updateCoupon = async (id: string, data: CouponInput) => {
  const res = await axios.put(`${API_URL}/edit/${id}`, data);
  return res.data.data;
};

export const deleteCoupon = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const validateCoupon = async (code: string) => {
  const res = await axios.get(`${API_URL}/validate/${code}`);
  return res.data.data;
};