import { prisma } from "@davinci/database";
import { CreateLeaveInput, UpdateLeaveStatusInput } from "./leave.schema";

export class LeaveService {
  async create(data: CreateLeaveInput, companyId: string) {
    // REGRA: impedir sobreposição
    const overlapping = await prisma.leave.findFirst({
      where: {
        employeeId: data.employeeId,
        companyId,
        status: {
          in: ["PENDING", "APPROVED"]
        },
        startDate: {
          lte: new Date(data.endDate || data.startDate)
        },
        endDate: {
          gte: new Date(data.startDate)
        }
      }
    });

    if (overlapping) {
      throw new Error("Leave overlap not allowed");
    }

    return prisma.leave.create({
      data: {
        employeeId: data.employeeId,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: "PENDING",
        companyId
      }
    });
  }

  async list(companyId: string) {
    return prisma.leave.findMany({
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

  async updateStatus(id: string, data: UpdateLeaveStatusInput, companyId: string) {
    const leave = await prisma.leave.findFirst({
      where: { id, companyId }
    });

    if (!leave) {
      throw new Error("Leave not found");
    }

    return prisma.leave.update({
      where: { id },
      data: {
        status: data.status
      }
    });
  }
}