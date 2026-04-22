import { prisma } from "@davinci/database";
import { CreatePayrollInput, AddItemInput } from "./payroll.schema";

export class PayrollService {
  async create(data: CreatePayrollInput, companyId: string) {
    // REGRA: evitar duplicidade por período
    const existing = await prisma.payroll.findFirst({
      where: {
        employeeId: data.employeeId,
        referenceMonth: data.referenceMonth,
        referenceYear: data.referenceYear,
        companyId
      }
    });

    if (existing) {
      throw new Error("Payroll already exists for this period");
    }

    return prisma.payroll.create({
      data: {
        employeeId: data.employeeId,
        referenceMonth: data.referenceMonth,
        referenceYear: data.referenceYear,
        baseSalary: data.baseSalary,
        netSalary: data.baseSalary,
        companyId
      }
    });
  }

  async addItem(payrollId: string, data: AddItemInput) {
    const item = await prisma.payrollItem.create({
      data: {
        payrollId,
        description: data.description,
        type: data.type,
        amount: data.amount
      }
    });

    return item;
  }

  async list(companyId: string) {
    return prisma.payroll.findMany({
      where: { companyId },
      include: {
        employee: {
          select: {
            name: true
          }
        },
        items: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
}