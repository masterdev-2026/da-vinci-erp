import { z } from "zod";

export const createTimeRecordSchema = z.object({
  employeeId: z.string(),
  type: z.enum(["CLOCK_IN", "CLOCK_OUT"])
});

export type CreateTimeRecordInput = z.infer<typeof createTimeRecordSchema>;