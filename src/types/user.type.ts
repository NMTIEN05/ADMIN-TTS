export interface User {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserInput {
  fullname: string;
  email: string;
  password: string;
  phone?: string;
  isAdmin?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}