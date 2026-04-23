import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../services/financial.service";
import type { FinancialAccountOption } from "../types/financial.types";

export function useAccounts() {
  return useQuery<FinancialAccountOption[]>({
    queryKey: ["financial", "accounts"],
    queryFn: getAccounts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}