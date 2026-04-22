import { prisma } from "@davinci/database";
import { CreateOvertimeInput } from "./overtime.schema";

export class OvertimeService {
  async create(data: CreateOvertimeInput, companyId: string) {
    const employee = await prisma.employee.findFirst({
      where: {
        id: data.employeeId,
        companyId
      }
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    return prisma.overtimeBank.create({
      data: {
        employeeId: data.employeeId,
        minutes: data.minutes,
        type: data.type,
        referenceDate: new Date(data.referenceDate),
        companyId
      }
    });
  }

  async list(companyId: string) {
    return prisma.overtimeBank.findMany({
      where: { companyId },
      include: {
        employee: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async balance(employeeId: string, companyId: string) {
    const records = await prisma.overtimeBank.findMany({
      where: {
        employeeId,
        companyId
      }
    });

    const balance = records.reduce((acc, r) => {
      return r.type === "CREDIT"
        ? acc + r.minutes
        : acc - r.minutes;
    }, 0);

    return {
      employeeId,
      balanceMinutes: balance
    };
  }
}