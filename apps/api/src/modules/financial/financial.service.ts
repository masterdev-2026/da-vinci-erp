import { prisma } from "@davinci/database";

export class FinancialService {

  // ========================
  // CONTAS A PAGAR
  // ========================
  async getPayables(companyId: string) {
    return prisma.transaction.findMany({
      where: {
        companyId,
        type: "EXPENSE"
      },
      include: {
        category: true,
        account: true
      },
      orderBy: {
        dueDate: "asc"
      }
    });
  }

  // ========================
  // CONTAS A RECEBER
  // ========================
  async getReceivables(companyId: string) {
    return prisma.transaction.findMany({
      where: {
        companyId,
        type: "INCOME"
      },
      include: {
        category: true,
        account: true
      },
      orderBy: {
        dueDate: "asc"
      }
    });
  }

  // ========================
  // CONCILIAÇÃO (BÁSICO)
  // ========================
  async getReconciliation(companyId: string) {
    return prisma.transaction.findMany({
      where: {
        companyId,
        status: "PAID"
      },
      include: {
        category: true,
        account: true
      },
      orderBy: {
        paidAt: "desc"
      }
    });
  }

  // ========================
  // EXTRATO GERAL
  // ========================
  async getStatement(companyId: string) {
    return prisma.transaction.findMany({
      where: { companyId },
      include: {
        category: true,
        account: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  // ========================
  // EXTRATO POR CONTA (ATM)
  // ========================
  async getAccountStatement(companyId: string, accountId: string) {
    return prisma.transaction.findMany({
      where: {
        companyId,
        accountId
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: "asc" // importante pro saldo progressivo
      }
    });
  }
}