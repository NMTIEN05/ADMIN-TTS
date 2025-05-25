export interface Category {
  id: string | number;
  name: string;
  description: string;
}

export type CategoryInput = Omit<Category, "id">;
