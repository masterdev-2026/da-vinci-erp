import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z.string(),
  document: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  positionId: z.string()
});

export const createAdmissionSchema = z.object({
  employeeId: z.string(),
  date: z.string(),
  salary: z.number()
});

export const createTerminationSchema = z.object({
  employeeId: z.string(),
  date: z.string(),
  reason: z.string().optional()
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type CreateAdmissionInput = z.infer<typeof createAdmissionSchema>;
export type CreateTerminationInput = z.infer<typeof createTerminationSchema>;