import { z } from "zod";

export const createOvertimeSchema = z.object({
  employeeId: z.string(),
  minutes: z.number().int(),
  type: z.enum(["CREDIT", "DEBIT"]),
  referenceDate: z.string()
});

export type CreateOvertimeInput = z.infer<typeof createOvertimeSchema>;