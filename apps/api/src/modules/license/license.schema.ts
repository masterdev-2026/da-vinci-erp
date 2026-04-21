import { z } from "zod";

export const createLicenseSchema = z.object({
  type: z.enum(["CNH", "ANTT", "OTHER"]),
  number: z.string().min(3),
  expiresAt: z.string().datetime(),
  driverId: z.string().uuid()
});

export type CreateLicenseInput = z.infer<typeof createLicenseSchema>;