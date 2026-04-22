import { z } from "zod";

export const createPositionSchema = z.object({
  name: z.string().min(2)
});

export type CreatePositionInput = z.infer<typeof createPositionSchema>;