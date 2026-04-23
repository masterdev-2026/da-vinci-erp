import { z } from "zod";

export const createRequestSchema = z.object({
  employeeId: z.string(),
  type: z.enum([
    "VACATION",
    "LEAVE",
    "ADVANCE",
    "SHIFT_CHANGE",
    "OTHER"
  ]),
  title: z.string(),
  description: z.string().optional()
});

export const updateRequestSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  response: z.string().optional()
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;