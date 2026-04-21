import { z } from "zod";

export const createContractSchema = z.object({
  title: z.string().min(3),
  amount: z.number(),
  startDate: z.string().datetime(),
  recurrence: z.enum(["MONTHLY"]),
  driverId: z.string().uuid()
});

export type CreateContractInput = z.infer<typeof createContractSchema>;