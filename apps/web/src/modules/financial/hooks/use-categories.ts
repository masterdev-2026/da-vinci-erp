import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/financial.service";
import type { FinancialCategoryOption } from "../types/financial.types";

export function useCategories() {
  return useQuery<FinancialCategoryOption[]>({
    queryKey: ["financial", "categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}