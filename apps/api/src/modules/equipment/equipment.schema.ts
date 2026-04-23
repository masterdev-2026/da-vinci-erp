import { z } from "zod";

export const createEquipmentSchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

export const assignEquipmentSchema = z.object({
  employeeId: z.string(),
  equipmentId: z.string()
});

export const returnEquipmentSchema = z.object({
  returnedAt: z.string()
});

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;
export type AssignEquipmentInput = z.infer<typeof assignEquipmentSchema>;
export type ReturnEquipmentInput = z.infer<typeof returnEquipmentSchema>;