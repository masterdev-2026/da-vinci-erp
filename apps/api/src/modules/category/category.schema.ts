import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2),
  type: z.enum(["INCOME", "EXPENSE"])
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;