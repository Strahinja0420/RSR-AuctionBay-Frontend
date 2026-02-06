import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories.api";

export const useCategories = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return {
    categories: data ?? [],
    error,
    loading: isLoading,
    refetch,
  };
};
