import { apiInstance } from '../utils/axios.util';
import { API_ENDPOINTS } from '../constants';
import type { Order, OrderInput, OrderWithDetails } from '../types/order.type';

export const orderService = {
  getAll: async (): Promise<OrderWithDetails[]> => {
    const response = await apiInstance.get(API_ENDPOINTS.ORDERS);
    console.log('Orders API Response:', response.data);
    return response.data?.data || [];
  },

  getById: async (id: string): Promise<OrderWithDetails> => {
    const response = await apiInstance.get(`${API_ENDPOINTS.ORDERS}/${id}`);
    return response.data;
  },

  create: async (data: OrderInput): Promise<Order> => {
    const response = await apiInstance.post(API_ENDPOINTS.ORDERS_ADD, data);
    return response.data;
  },

  update: async (id: string, data: OrderInput): Promise<Order> => {
    const response = await apiInstance.put(API_ENDPOINTS.ORDERS_EDIT(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiInstance.delete(API_ENDPOINTS.ORDERS_DELETE(id));
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiInstance.patch(API_ENDPOINTS.ORDERS_STATUS(id), { status });
    return response.data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await apiInstance.patch(API_ENDPOINTS.ORDERS_CANCEL(id));
    return response.data;
  }
};