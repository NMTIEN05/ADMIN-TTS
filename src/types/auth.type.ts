export interface User {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullname: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}