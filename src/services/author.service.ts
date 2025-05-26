import axios from "axios";
import type { Author } from "@/types/author.type";

const API = "http://localhost:8888/api/authors";

export const getAuthors = async (): Promise<Author[]> => {
  const res = await axios.get(API);
  // Backend trả về: { success: true, data: { data: [...] } }
  return res.data.data.data;
};
