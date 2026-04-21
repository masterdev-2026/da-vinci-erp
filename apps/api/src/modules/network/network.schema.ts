import { z } from "zod";

export const createPartnerSchema = z.object({
  name: z.string().min(2),
  document: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional()
});

export const linkPartnerSchema = z.object({
  partnerId: z.string()
});