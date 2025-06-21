export const API_BASE_URL = 'http://localhost:8888';
export const AUTH_BASE_URL = 'http://localhost:8888/auth';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  USERS: '/users',
  
  // Categories
  CATEGORIES: '/api/categories',
  CATEGORIES_ADD: '/api/categories/add',
  CATEGORIES_EDIT: (id: string) => `/api/categories/edit/${id}`,
  CATEGORIES_DELETE: (id: string) => `/api/categories/${id}`,
  
  // Authors
  AUTHORS: '/api/authors',
  AUTHORS_ADD: '/api/authors/add',
  AUTHORS_EDIT: (id: string) => `/api/authors/edit/${id}`,
  AUTHORS_DELETE: (id: string) => `/api/authors/${id}`,
  
  // Books/Products
  BOOKS: '/api/books',
  BOOKS_ADD: '/api/books/add',
  BOOKS_EDIT: (id: string) => `/api/books/edit/${id}`,
  BOOKS_DELETE: (id: string) => `/api/books/${id}`,
  
  // Coupons
  COUPONS: '/api/coupons',
  COUPONS_ADD: '/api/coupons/add',
  COUPONS_EDIT: (id: string) => `/api/coupons/edit/${id}`,
  COUPONS_DELETE: (id: string) => `/api/coupons/${id}`,
  COUPONS_TOGGLE: (id: string) => `/api/coupons/toggle/${id}`,
  
  // Orders
  ORDERS: '/api/orders',
  ORDERS_ADD: '/api/orders/add',
  ORDERS_EDIT: (id: string) => `/api/orders/edit/${id}`,
  ORDERS_DELETE: (id: string) => `/api/orders/${id}`,
  ORDERS_STATUS: (id: string) => `/api/orders/status/${id}`,
  ORDERS_CANCEL: (id: string) => `/api/orders/cancel/${id}`,
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