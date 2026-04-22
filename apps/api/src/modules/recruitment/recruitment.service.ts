import { prisma } from "@davinci/database";
import {
  CreateJobInput,
  CreateCandidateInput,
  ApplyInput,
  UpdateApplicationInput
} from "./recruitment.schema";

export class RecruitmentService {
  async createJob(data: CreateJobInput, companyId: string) {
    return prisma.jobOpening.create({
      data: {
        title: data.title,
        description: data.description,
        companyId
      }
    });
  }

  async createCandidate(data: CreateCandidateInput, companyId: string) {
    return prisma.candidate.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyId
      }
    });
  }

  async apply(data: ApplyInput, companyId: string) {
    return prisma.application.create({
      data: {
        candidateId: data.candidateId,
        jobId: data.jobId,
        companyId
      }
    });
  }

  async listJobs(companyId: string) {
    return prisma.jobOpening.findMany({
      where: { companyId },
      include: {
        applications: true
      }
    });
  }

  async listCandidates(companyId: string) {
    return prisma.candidate.findMany({
      where: { companyId }
    });
  }

  async updateApplication(
    id: string,
    data: UpdateApplicationInput,
    companyId: string
  ) {
    return prisma.application.update({
      where: { id },
      data: {
        status: data.status
      }
    });
  }
}