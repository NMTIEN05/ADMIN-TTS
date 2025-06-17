import axios from "axios";
import type { Author, AuthorInput } from "@/types/author.type";

const API = "http://localhost:8888/api/authors";

// Map lại _id → id để khớp interface FE
const mapAuthor = (item: any): Author => ({
  _id: item._id,
  name: item.name,
  nationality: item.nationality,
  birth_date: item.birth_date,
  bio: item.bio,
});

export const getAuthors = async (): Promise<Author[]> => {
  const res = await axios.get(API);
  const rawList = res.data?.data?.data || [];
  return rawList.map(mapAuthor);
};

export const getAuthorById = async (id: string): Promise<Author> => {
  const res = await axios.get(`${API}/${id}`);
  return mapAuthor(res.data.data);
};

export const addAuthor = async (data: AuthorInput): Promise<Author> => {
  const res = await axios.post(`${API}/add`, data);
  return mapAuthor(res.data.data);
};

export const updateAuthor = async (
  id: string,
  data: AuthorInput
): Promise<Author> => {
  const res = await axios.put(`${API}/edit/${id}`, data);
  return mapAuthor(res.data.data);
};

export const deleteAuthor = async (id: string): Promise<any> => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
