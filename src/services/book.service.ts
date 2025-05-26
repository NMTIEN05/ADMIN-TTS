import axios from "axios";
import type { BookInput } from "@/types/book.type";

const API = "http://localhost:8888/api/books";

export const getBooks = async () => {
  const res = await axios.get(API);
  return res.data.data.data;
};

export const addBook = async (data: BookInput) => {
  const res = await axios.post(`${API}/add`, data);
  return res.data.data;
};

export const updateBook = async (id: string, data: BookInput) => {
  const res = await axios.put(`${API}/edit/${id}`, data);
  return res.data.data;
};

export const deleteBook = async (id: string) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data.data;
};
