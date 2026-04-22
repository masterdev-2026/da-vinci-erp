import { z } from "zod";

export const createMaintenanceSchema = z.object({
  vehicleId: z.string(),
  type: z.enum(["PREVENTIVE", "CORRECTIVE"]),
  description: z.string(),
  cost: z.number().min(0),
  date: z.string()
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;