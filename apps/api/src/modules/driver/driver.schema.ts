import { z } from "zod";

export const createDriverSchema = z.object({
  name: z.string().min(2),
  document: z.string().min(5),
  license: z.string().min(3),
  phone: z.string().optional()
});

export const updateDriverSchema = z.object({
  name: z.string().min(2).optional(),
  license: z.string().min(3).optional(),
  phone: z.string().optional()
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;