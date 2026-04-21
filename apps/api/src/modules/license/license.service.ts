import { prisma } from "@davinci/database";
import { CreateLicenseInput } from "./license.schema";

export class LicenseService {
  async create(data: CreateLicenseInput, companyId: string) {
    return prisma.license.create({
      data: {
        ...data,
        companyId
      }
    });
  }

  async list(companyId: string) {
    return prisma.license.findMany({
      where: { companyId },
      include: {
        driver: true
      },
      orderBy: {
        expiresAt: "asc"
      }
    });
  }

  async getExpiring(companyId: string) {
    const now = new Date();
    const next30 = new Date();
    next30.setDate(now.getDate() + 30);

    return prisma.license.findMany({
      where: {
        companyId,
        expiresAt: {
          lte: next30
        }
      },
      include: {
        driver: true
      },
      orderBy: {
        expiresAt: "asc"
      }
    });
  }
}