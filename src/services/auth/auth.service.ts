import axios from "axios";
import type { LoginInput, RegisterInput, User } from "@/types/auth.type";

const API_URL = "http://localhost:8888/auth";

export const login = async (data: LoginInput) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};

export const register = async (data: RegisterInput) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get(`${API_URL}/users`);
  return res.data || [];
};

export const getUserById = async (id: string) => {
  const res = await axios.get(`${API_URL}/users/${id}`);
  return res.data;
};

export const updateUser = async (id: string, data: Partial<User>) => {
  const res = await axios.put(`${API_URL}/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axios.delete(`${API_URL}/users/${id}`);
  return res.data;
};