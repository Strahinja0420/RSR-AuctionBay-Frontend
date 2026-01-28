import { useEffect, useState } from "react";
import type { Category } from "../types/Category.type";
import { getCategories } from "../api/categories.api";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, refetch: fetchCategories };
};
