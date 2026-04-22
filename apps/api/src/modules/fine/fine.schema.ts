import { z } from "zod";

export const createFineSchema = z.object({
  vehicleId: z.string(),
  code: z.string(),
  description: z.string(),
  amount: z.number().positive(),
  date: z.string()
});

export const payFineSchema = z.object({
  id: z.string()
});

export type CreateFineInput = z.infer<typeof createFineSchema>;