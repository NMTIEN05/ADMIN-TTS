import axios from "axios";
import type { Order, OrderFullDetail } from "../types/order.type";

const API_URL = "http://localhost:8888/api/orders";

export const getOrders = (params: any) => axios.get(`${API_URL}`, { params });
export const getOrderById = (id: string) => axios.get<{ data: OrderFullDetail }>(`${API_URL}/${id}`);
export const deleteOrder = (id: string) => axios.delete(`${API_URL}/${id}`);
export const updateOrderStatus = (id: string, status: string) =>
  axios.patch(`${API_URL}/status/${id}`, { status });
export const cancelOrder = (id: string) => axios.patch(`${API_URL}/cancel/${id}`);
