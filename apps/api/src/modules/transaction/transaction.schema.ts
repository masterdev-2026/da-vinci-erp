import { z } from "zod";

export const createTransactionSchema = z.object({
  title: z.string().min(2),
  amount: z.number(),
  type: z.enum(["INCOME", "EXPENSE"]),
  dueDate: z.string(),

  categoryId: z.string(),
  accountId: z.string(),

  customerId: z.string().optional(),
  supplierId: z.string().optional()
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;