import { apiInstance } from '@/utils/axios.util'
import { API_ENDPOINTS } from '@/constants'
import type { FlashSale, FlashSaleInput, FlashSaleItem, FlashSaleItemInput } from '../types/flash_sale.type'

export const flashSaleKeys = {
  all: ['flash-sales'] as const,
  list: () => [...flashSaleKeys.all, 'list'] as const,
  detail: (id: string) => [...flashSaleKeys.all, 'detail', id] as const
}

export const flashSaleItemKeys = {
  all: ['flash-sale-items'] as const,
  list: () => [...flashSaleItemKeys.all, 'list'] as const,
  byFlashSale: (flashSaleId: string) => [...flashSaleItemKeys.list(), { flashSaleId }] as const,
  detail: (id: string) => [...flashSaleItemKeys.all, 'detail', id] as const
}

export const flashSaleService = {
  getAll: async (): Promise<FlashSale[]> => {
    const res = await apiInstance.get(`${API_ENDPOINTS.FLASHSALE}`)
    return res.data?.results || []
  },

  getById: async (id: string): Promise<FlashSale> => {
    const res = await apiInstance.get(`${API_ENDPOINTS.FLASHSALE}/${id}`)
    return res.data?.data
  },

  create: async (data: FlashSaleInput): Promise<FlashSale> => {
    const res = await apiInstance.post(API_ENDPOINTS.FLASHSALE, data)
    return res.data?.data
  },

  update: async (id: string, data: FlashSaleInput): Promise<FlashSale> => {
    const res = await apiInstance.patch(`${API_ENDPOINTS.FLASHSALE}/${id}`, data)
    return res.data?.data
  },

  delete: async (id: string): Promise<void> => {
    await apiInstance.delete(`${API_ENDPOINTS.FLASHSALE}/${id}`)
  },

  activate: async (id: string): Promise<FlashSale> => {
    const res = await apiInstance.post(`${API_ENDPOINTS.FLASHSALE}/${id}/activate`)
    return res.data?.data
  },

  deactivate: async (id: string): Promise<FlashSale> => {
    const res = await apiInstance.post(`${API_ENDPOINTS.FLASHSALE}/${id}/deactivate`)
    return res.data?.data
  }
}

export const flashSaleItemService = {
  getAll: async (params?: { flashSaleId?: string; current?: number; pageSize?: number }): Promise<FlashSaleItem[]> => {
    const res = await apiInstance.get(API_ENDPOINTS.FLASHSALE_ITEM, { params })
    return res.data?.results || []
  },

  getById: async (id: string): Promise<FlashSaleItem> => {
    const res = await apiInstance.get(`${API_ENDPOINTS.FLASHSALE_ITEM}/${id}`)
    return res.data?.data
  },

  create: async (data: FlashSaleItemInput): Promise<FlashSaleItem> => {
    const res = await apiInstance.post(API_ENDPOINTS.FLASHSALE_ITEM, data)
    return res.data?.data
  },

  update: async (id: string, data: Partial<FlashSaleItemInput>): Promise<FlashSaleItem> => {
    const res = await apiInstance.patch(`${API_ENDPOINTS.FLASHSALE_ITEM}/${id}`, data)
    return res.data?.data
  },

  delete: async (id: string): Promise<void> => {
    await apiInstance.delete(`${API_ENDPOINTS.FLASHSALE_ITEM}/${id}`)
  }
}
