import { useQuery } from "@tanstack/react-query"
import { getReceivables } from "../services/financial.service"
import type { FinancialTransaction } from "../types/financial.types"

export function useReceivables() {
  return useQuery<FinancialTransaction[]>({
    queryKey: ["financial", "receivables"],
    queryFn: getReceivables,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })
}