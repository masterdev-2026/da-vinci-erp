import { api } from "@/services/api"
import type { FinancialTransaction } from "../types/financial.types"

export async function getReceivables() {
  const { data } = await api.get<FinancialTransaction[]>("/financial/receivables")
  return data
}