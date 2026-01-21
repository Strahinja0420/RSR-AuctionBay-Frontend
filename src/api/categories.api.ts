import type { Category } from "../types/Category.type";
import api from "./axios";

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/categories");

  return res.data;
};
