import { useQuery } from "@tanstack/react-query";
import type { FinancialTransaction } from "../types/financial.types";
import { getPayables } from "../services/financial.service";

export function usePayables() {
  return useQuery<FinancialTransaction[]>({
    queryKey: ["financial", "payables"],
    queryFn: getPayables,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}