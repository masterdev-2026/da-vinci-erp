import { api } from "@/services/api";
import type {
  CreateFinancialTransactionInput,
  FinancialAccountOption,
  FinancialCategoryOption,
  FinancialTransaction,
} from "../types/financial.types";

export async function getReceivables() {
  const { data } = await api.get<FinancialTransaction[]>("/financial/receivables");
  return data;
}

export async function getPayables() {
  const { data } = await api.get<FinancialTransaction[]>("/financial/payables");
  return data;
}

export async function createFinancialTransaction(
  payload: CreateFinancialTransactionInput
) {
  const { data } = await api.post<FinancialTransaction>("/financial", payload);
  return data;
}

export async function getAccounts() {
  const { data } = await api.get<FinancialAccountOption[]>("/accounts");
  return data;
}

export async function getCategories() {
  const { data } = await api.get<FinancialCategoryOption[]>("/categories");
  return data;
}