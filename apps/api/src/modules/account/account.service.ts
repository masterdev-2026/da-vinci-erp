import { prisma } from "@davinci/database";
import { CreateAccountInput } from "./account.schema";

export class AccountService {
  async create(data: CreateAccountInput, companyId: string) {
    const account = await prisma.financialAccount.create({
      data: {
        name: data.name,
        balance: data.balance,
        companyId
      }
    });

    return {
      ...account,
      balance: Number(account.balance)
    };
  }

  async list(companyId: string) {
    const accounts = await prisma.financialAccount.findMany({
      where: {
        companyId
      },
      orderBy: {
        name: "asc"
      }
    });

    return accounts.map(acc => ({
      ...acc,
      balance: Number(acc.balance)
    }));
  }
}