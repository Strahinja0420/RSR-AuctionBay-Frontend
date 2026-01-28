import type { Category } from "../types/Category.type";
import api from "./axios";

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/categories");

  return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const res = await api.post("/categories", data);
  return res.data;
};

export const updateCategory = async (id: number, data: Partial<Category>): Promise<Category> => {
  const res = await api.patch(`/categories/${id}`, data);
  return res.data;
};
