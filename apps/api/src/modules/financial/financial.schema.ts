import { z } from "zod";

export const createFinancialTransactionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  type: z.enum(["INCOME", "EXPENSE"]),
  status: z.enum(["PENDING", "PAID", "OVERDUE"]).default("PENDING"),
  dueDate: z.coerce.date(),
  paidAt: z.coerce.date().optional().nullable(),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  accountId: z.string().min(1, "Conta é obrigatória"),
  customerId: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
});

export type CreateFinancialTransactionInput = z.infer<
  typeof createFinancialTransactionSchema
>;