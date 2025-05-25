import axios from "axios";
import type { Category, CategoryInput } from "@/types/category.type";

const API = "http://localhost:8888/api/categories";

// ✅ Map lại _id → id để khớp interface FE
const mapCategory = (item: any): Category => ({
  _id: item._id, // 👈 thêm lại _id
  id: item._id,
  name: item.name,
  description: item.description,
});


export const getCategories = async (): Promise<Category[]> => {
  const res = await axios.get(API);
  const rawList = res.data?.data?.data || []; // ⚠️ backend có nested "data.data"

  return rawList.map(mapCategory);
};

export const addCategory = async (data: CategoryInput): Promise<Category> => {
  const res = await axios.post(`${API}/add`, data);
  return mapCategory(res.data.data);
};

export const updateCategory = async (
  id: number | string,
  data: CategoryInput
): Promise<Category> => {
  const res = await axios.put(`${API}/edit/${id}`, data);
  return mapCategory(res.data.data);
};

export const deleteCategory = async (id: number | string): Promise<any> => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
