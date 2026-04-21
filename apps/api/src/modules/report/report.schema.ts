import { z } from "zod";

export const reportFilterSchema = z.object({
  startDate: z.string(),
  endDate: z.string()
});