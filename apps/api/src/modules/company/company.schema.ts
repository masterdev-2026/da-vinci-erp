import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(2),
  document: z.string().optional()
});

export const updateCompanySchema = z.object({
  name: z.string().min(2).optional(),
  document: z.string().optional()
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;