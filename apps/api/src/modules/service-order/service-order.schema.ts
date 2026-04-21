import { z } from "zod";

export const createServiceOrderSchema = z.object({
  title: z.string().min(2),
  value: z.number(),

  customerId: z.string().optional(),
  partnerId: z.string().optional(),

  scheduledAt: z.string().optional()
});

export const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE"])
});

export type CreateServiceOrderInput = z.infer<typeof createServiceOrderSchema>;