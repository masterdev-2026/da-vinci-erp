import { prisma } from "@davinci/database";
import { CreateInspectionInput } from "./inspection.schema";

export class InspectionService {
  async create(data: CreateInspectionInput, companyId: string) {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: data.vehicleId,
        companyId
      }
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    let status: "APPROVED" | "REJECTED" = "APPROVED";

    if (data.items) {
      const hasFailure = data.items.some((i) => !i.value);
      if (hasFailure) {
        status = "REJECTED";
      }
    }

    const inspection = await prisma.inspection.create({
      data: {
        vehicleId: data.vehicleId,
        notes: data.notes,
        items: data.items,
        status,
        companyId
      }
    });

    return inspection;
  }

  async list(companyId: string) {
    return prisma.inspection.findMany({
      where: { companyId },
      include: {
        vehicle: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async dashboard(companyId: string) {
    const total = await prisma.inspection.count({
      where: { companyId }
    });

    const approved = await prisma.inspection.count({
      where: {
        companyId,
        status: "APPROVED"
      }
    });

    const rejected = await prisma.inspection.count({
      where: {
        companyId,
        status: "REJECTED"
      }
    });

    return prisma.inspection.findMany({
      where: { companyId },
      include: {
        vehicle: {
          select: {
            plate: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}