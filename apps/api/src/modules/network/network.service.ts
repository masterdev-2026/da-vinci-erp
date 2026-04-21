import { prisma } from "@davinci/database";
import { AppError } from "../../shared/errors/app-error";

export class NetworkService {

  async createPartner(data: any, companyId: string) {
    return prisma.partner.create({
      data: {
        ...data,
        companyId
      }
    });
  }

  async linkPartner(partnerId: string, companyId: string) {

    const partner = await prisma.partner.findFirst({
      where: { id: partnerId, companyId }
    });

    if (!partner) {
      throw new AppError("Partner not found", 404);
    }

    return prisma.networkLink.create({
      data: {
        partnerId,
        companyId
      }
    });
  }

  async list(companyId: string) {
    return prisma.networkLink.findMany({
      where: { companyId },
      include: {
        partner: true
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async dashboard(companyId: string) {
    const links = await prisma.networkLink.findMany({
      where: { companyId }
    });

    return {
      total: links.length,
      active: links.filter(l => l.status === "ACTIVE").length,
      inactive: links.filter(l => l.status !== "ACTIVE").length
    };
  }
}