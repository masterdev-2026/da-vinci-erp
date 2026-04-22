import { z } from "zod";

export const createFuelSchema = z.object({
  vehicleId: z.string(),
  liters: z.number().positive(),
  price: z.number().positive(),
  km: z.number().positive(),
  date: z.string()
});

export type CreateFuelInput = z.infer<typeof createFuelSchema>;