import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(3),
  document: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

export const updateSupplierSchema = createSupplierSchema.partial();

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;