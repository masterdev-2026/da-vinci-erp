import { z } from "zod";

export const createLeaveSchema = z.object({
  employeeId: z.string(),
  type: z.enum(["MEDICAL", "MATERNITY", "ACCIDENT", "OTHER"]),
  startDate: z.string(),
  endDate: z.string().optional(),
  reason: z.string().optional()
});

export const updateLeaveStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"])
});

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type UpdateLeaveStatusInput = z.infer<typeof updateLeaveStatusSchema>;