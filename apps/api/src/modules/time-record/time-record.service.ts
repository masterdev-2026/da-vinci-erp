import { prisma } from "@davinci/database";
import { CreateTimeRecordInput } from "./time-record.schema";

export class TimeRecordService {
  async create(data: CreateTimeRecordInput, companyId: string) {
    const employee = await prisma.employee.findFirst({
      where: {
        id: data.employeeId,
        companyId
      }
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    // REGRA: evitar duplicidade (ex: 2 entradas seguidas)
    const lastRecord = await prisma.timeRecord.findFirst({
      where: {
        employeeId: data.employeeId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (lastRecord && lastRecord.type === data.type) {
      throw new Error("Invalid sequence: duplicate clock type");
    }

    const record = await prisma.timeRecord.create({
      data: {
        employeeId: data.employeeId,
        type: data.type,
        timestamp: new Date(),
        companyId
      }
    });

    return record;
  }

  async list(companyId: string) {
    return prisma.timeRecord.findMany({
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
}