import { prisma } from "@davinci/database";

export class HrDashboardService {
  async get(companyId: string) {
    const now = new Date();

    //  funcionários
    const totalEmployees = await prisma.employee.count({
      where: { companyId }
    });

    const activeEmployees = await prisma.employee.count({
      where: {
        companyId,
        status: "ACTIVE"
      }
    });

    const inactiveEmployees = await prisma.employee.count({
      where: {
        companyId,
        status: "INACTIVE"
      }
    });

    //  férias em andamento
    const vacationsInProgress = await prisma.vacation.count({
      where: {
        companyId,
        status: "APPROVED",
        startDate: { lte: now },
        endDate: { gte: now }
      }
    });

    //  afastamentos ativos
    const activeLeaves = await prisma.leave.count({
      where: {
        companyId,
        status: "APPROVED",
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } }
        ]
      }
    });

    //  folha atual
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const payrolls = await prisma.payroll.findMany({
      where: {
        companyId,
        referenceMonth: currentMonth,
        referenceYear: currentYear
      }
    });

    const totalPayrollCost = payrolls.reduce(
      (acc, p) => acc + p.netSalary,
      0
    );

    // ⏱ banco de horas (resumo geral)
    const overtime = await prisma.overtimeBank.findMany({
      where: { companyId }
    });

    const overtimeBalance = overtime.reduce((acc, item) => {
      return item.type === "CREDIT"
        ? acc + item.minutes
        : acc - item.minutes;
    }, 0);

    return {
      employees: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees
      },
      vacationsInProgress,
      activeLeaves,
      payroll: {
        month: currentMonth,
        year: currentYear,
        totalCost: totalPayrollCost
      },
      overtimeBalanceMinutes: overtimeBalance
    };
  }
}