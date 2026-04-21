import { z } from "zod";

export const createBankSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2)
});

export const updateBankSchema = createBankSchema.partial();

export type CreateBankInput = z.infer<typeof createBankSchema>;
export type UpdateBankInput = z.infer<typeof updateBankSchema>;