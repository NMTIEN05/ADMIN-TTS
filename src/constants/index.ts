export const API_BASE_URL = 'http://localhost:8888/api';
export const AUTH_BASE_URL = 'http://localhost:8888/auth';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  USERS: '/users',
  USERS_RESTORE: (id: string) => `/users/restore/${id}`,
  USERS_DELETED: '/users/deleted',
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORIES_ADD: '/categories/add',
  CATEGORIES_EDIT: (id: string) => `/categories/edit/${id}`,
  CATEGORIES_DELETE: (id: string) => `/categories/${id}`,
  CATEGORIES_RESTORE: (id: string) => `/categories/restore/${id}`,
  CATEGORIES_DELETED: '/categories/deleted',
  
  // Authors
  AUTHORS: '/authors',
  AUTHORS_ADD: '/authors/add',
  AUTHORS_EDIT: (id: string) => `/authors/edit/${id}`,
  AUTHORS_DELETE: (id: string) => `/authors/${id}`,
  AUTHORS_RESTORE: (id: string) => `/authors/restore/${id}`,
  AUTHORS_DELETED: '/authors/deleted',
  
  // Books/Products
  BOOKS: '/books',
  BOOKS_ADD: '/books/add',
  BOOKS_EDIT: (id: string) => `/books/edit/${id}`,
  BOOKS_DELETE: (id: string) => `/books/${id}`,
  BOOKS_RESTORE: (id: string) => `/books/restore/${id}`,
  BOOKS_DELETED: '/books/deleted',
  
  // Coupons
  COUPONS: '/coupons',
  COUPONS_ADD: '/coupons/add',
  COUPONS_EDIT: (id: string) => `/coupons/edit/${id}`,
  COUPONS_DELETE: (id: string) => `/coupons/${id}`,
  COUPONS_RESTORE: (id: string) => `/coupons/restore/${id}`,
  COUPONS_DELETED: '/coupons/deleted',
  COUPONS_TOGGLE: (id: string) => `/coupons/toggle/${id}`,
  
  // Orders
  ORDERS: '/orders',
  ORDERS_ADD: '/orders/add',
  ORDERS_EDIT: (id: string) => `/orders/edit/${id}`,
  ORDERS_DELETE: (id: string) => `/orders/${id}`,
  ORDERS_STATUS: (id: string) => `/orders/status/${id}`,
  ORDERS_CANCEL: (id: string) => `/orders/cancel/${id}`,

  // Flash sale
  FLASHSALE: '/flashsales',
  FLASHSALE_ADD: '/flashsales/add',
  FLASHSALE_EDIT: (id: string) => `/flashsales/edit/${id}`,
  FLASHSALE_DELETE: (id: string) => `/flashsales/${id}`,
  FLASHSALE_TOGGLE: (id: string) => `/flashsales/toggle/${id}`,

  // Flash sale items
  FLASHSALE_ITEM: '/flashsales/items/all',
  FLASHSALE_ITEM_ADD: '/flashsales/items',
  FLASHSALE_ITEM_EDIT: (id: string) => `/flashsales/items/${id}`,
  FLASHSALE_ITEM_DELETE: (id: string) => `/flashsales/items/${id}`,
};



export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export const COUPON_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
} as const;