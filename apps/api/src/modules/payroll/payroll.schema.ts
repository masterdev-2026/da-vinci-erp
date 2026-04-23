import { z } from "zod";

export const createPayrollSchema = z.object({
  employeeId: z.string(),
  referenceMonth: z.number(),
  referenceYear: z.number(),
  baseSalary: z.number()
});

export const addItemSchema = z.object({
  description: z.string(),
  amount: z.number(),
  type: z.enum(["EARNING", "DEDUCTION"])
});

export type CreatePayrollInput = z.infer<typeof createPayrollSchema>;
export type AddItemInput = z.infer<typeof addItemSchema>;