import { z } from "zod";

export const createVacationSchema = z.object({
  employeeId: z.string(),
  startDate: z.string(),
  endDate: z.string()
});

export const updateVacationStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"])
});

export type CreateVacationInput = z.infer<typeof createVacationSchema>;
export type UpdateVacationStatusInput = z.infer<typeof updateVacationStatusSchema>;