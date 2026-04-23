import { z } from "zod";

export const inspectionItemSchema = z.object({
  label: z.string(),
  value: z.boolean()
});

export const createInspectionSchema = z.object({
  vehicleId: z.string(),
  notes: z.string().optional(),
  items: z.array(inspectionItemSchema).optional(),
  date: z.string()
});

export type CreateInspectionInput = z.infer<typeof createInspectionSchema>;