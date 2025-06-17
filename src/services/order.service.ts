import axios from "axios";
import type { Order, OrderFullDetail, OrderInput } from "../types/order.type";

const API_URL = "http://localhost:8888/api/orders";

export const getOrders = async (params: any = {}) => {
  const res = await axios.get(`${API_URL}`, { params });
  return res.data.data || [];
};

export const getOrderById = async (id: string) => {
  const res = await axios.get<{ data: OrderFullDetail }>(`${API_URL}/${id}`);
  return res.data.data;
};

export const createOrder = async (data: OrderInput) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data.data;
};

export const deleteOrder = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const res = await axios.patch(`${API_URL}/status/${id}`, { status });
  return res.data.data;
};

export const cancelOrder = async (id: string) => {
  const res = await axios.patch(`${API_URL}/cancel/${id}`);
  return res.data.data;
};
