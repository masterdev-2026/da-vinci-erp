export type FinancialStatus = "PENDING" | "PAID" | "OVERDUE"
export type FinancialType = "INCOME" | "EXPENSE"

export type FinancialCategory = {
  id: string
  name: string
  type: FinancialType
}

export type FinancialAccount = {
  id: string
  name: string
  bankId?: string | null
  balance?: number
}

export type FinancialTransaction = {
  id: string
  title: string
  amount: number | string
  type: FinancialType
  status: FinancialStatus
  dueDate: string
  paidAt?: string | null
  createdAt: string
  categoryId: string
  accountId: string
  companyId: string
  customerId?: string | null
  supplierId?: string | null
  category: FinancialCategory
  account: FinancialAccount
}