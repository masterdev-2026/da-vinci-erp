import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string(),
  description: z.string().optional()
});

export const createCandidateSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional()
});

export const applySchema = z.object({
  candidateId: z.string(),
  jobId: z.string()
});

export const updateApplicationSchema = z.object({
  status: z.enum(["INTERVIEW", "APPROVED", "REJECTED"])
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type ApplyInput = z.infer<typeof applySchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;