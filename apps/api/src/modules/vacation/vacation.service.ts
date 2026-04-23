import { prisma } from "@davinci/database";
import { CreateVacationInput, UpdateVacationStatusInput } from "./vacation.schema";

export class VacationService {
  async create(data: CreateVacationInput, companyId: string) {
    // REGRA: impedir sobreposição
    const overlapping = await prisma.vacation.findFirst({
      where: {
        employeeId: data.employeeId,
        companyId,
        status: {
          in: ["PENDING", "APPROVED"]
        },
        startDate: { lte: new Date(data.endDate) },
        endDate: { gte: new Date(data.startDate) }
      }
    });

    if (overlapping) {
      throw new Error("Vacation overlap not allowed");
    }

    return prisma.vacation.create({
      data: {
        employeeId: data.employeeId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: "PENDING",
        companyId
      }
    });
  }

  async list(companyId: string) {
    return prisma.vacation.findMany({
      where: { companyId },
      include: {
        employee: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async updateStatus(id: string, data: UpdateVacationStatusInput, companyId: string) {
    const vacation = await prisma.vacation.findFirst({
      where: { id, companyId }
    });

    if (!vacation) {
      throw new Error("Vacation not found");
    }

    return prisma.vacation.update({
      where: { id },
      data: {
        status: data.status
      }
    });
  }
}