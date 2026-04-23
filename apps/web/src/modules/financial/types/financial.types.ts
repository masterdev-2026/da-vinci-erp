export type FinancialStatus = "PENDING" | "PAID" | "OVERDUE";
export type FinancialType = "INCOME" | "EXPENSE";

export type FinancialCategory = {
  id: string;
  name: string;
  type: FinancialType;
};

export type FinancialAccount = {
  id: string;
  name: string;
  bankId?: string | null;
  balance?: number | string | null;
};

export type FinancialTransaction = {
  id: string;
  title: string;
  amount: number | string;
  type: FinancialType;
  status: FinancialStatus;
  dueDate: string;
  paidAt?: string | null;
  createdAt: string;
  categoryId: string;
  accountId: string;
  companyId: string;
  customerId?: string | null;
  supplierId?: string | null;
  category?: FinancialCategory | null;
  account?: FinancialAccount | null;
};

export type FinancialTotals = {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
};

export type FinancialKPIKey = keyof FinancialTotals;

export type FinancialKPIConfig = {
  title: string;
  description: string;
  icon: React.ElementType;
  valueKey: FinancialKPIKey;
};

export type CreateFinancialTransactionInput = {
  title: string;
  amount: number;
  type: FinancialType;
  status: FinancialStatus;
  dueDate: string;
  paidAt?: string | null;
  categoryId: string;
  accountId: string;
  customerId?: string | null;
  supplierId?: string | null;
};

export type FinancialCategoryOption = {
  id: string;
  name: string;
  type: FinancialType;
};

export type FinancialAccountOption = {
  id: string;
  name: string;
  balance?: number | string | null;
  bankId?: string | null;
};