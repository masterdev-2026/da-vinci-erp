import { z } from "zod";

export const createVehicleSchema = z.object({
  plate: z.string().min(5),
  model: z.string(),
  brand: z.string(),
  year: z.number().int().min(1900)
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;