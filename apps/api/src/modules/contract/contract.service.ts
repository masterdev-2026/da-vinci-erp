import { prisma } from "@davinci/database";
import { CreateContractInput } from "./contract.schema";

export class ContractService {
  async create(data: CreateContractInput, companyId: string) {
    const contract = await prisma.contract.create({
      data: {
        ...data,
        companyId
      }
    });

    //  GERA PRIMEIRA TRANSAÇÃO
    await this.generateTransactionForContract(contract.id, companyId);

    return contract;
  }

  async list(companyId: string) {
    return prisma.contract.findMany({
      where: { companyId },
      include: {
        driver: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  // ========================
  //  GERAÇÃO INTELIGENTE
  // ========================

  async generateMonthlyTransactions(companyId: string) {
    const contracts = await prisma.contract.findMany({
      where: { companyId }
    });

    for (const contract of contracts) {
      await this.generateTransactionForContract(contract.id, companyId);
    }
  }

  private async generateTransactionForContract(
    contractId: string,
    companyId: string
  ) {
    const contract = await prisma.contract.findFirst({
      where: { id: contractId, companyId }
    });

    if (!contract) return;

    const now = new Date();

    //  intervalo do mês atual
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    //  evita duplicidade
    const alreadyExists = await prisma.transaction.findFirst({
      where: {
        companyId,
        title: `Contrato: ${contract.title}`,
        dueDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    if (alreadyExists) return;

    const category = await this.getDefaultCategory(companyId);
    const account = await this.getDefaultAccount(companyId);

    //  usa o dia do contrato
    const dueDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      new Date(contract.startDate).getDate()
    );

    await prisma.transaction.create({
      data: {
        title: `Contrato: ${contract.title}`,
        amount: contract.amount,
        type: "EXPENSE",
        status: "PENDING",
        dueDate,

        categoryId: category,
        accountId: account,
        companyId
      }
    });
  }

  // ========================
  // HELPERS
  // ========================

  private async getDefaultCategory(companyId: string) {
    const category = await prisma.category.findFirst({
      where: { companyId },
      orderBy: { createdAt: "asc" }
    });

    if (!category) {
      throw new Error("No category found for this company");
    }

    return category.id;
  }

  private async getDefaultAccount(companyId: string) {
    const account = await prisma.financialAccount.findFirst({
      where: { companyId },
      orderBy: { createdAt: "asc" }
    });

    if (!account) {
      throw new Error("No account found for this company");
    }

    return account.id;
  }
}