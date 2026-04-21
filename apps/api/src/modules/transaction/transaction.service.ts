import { prisma } from "@davinci/database";
import { CreateTransactionInput } from "./transaction.schema";
import { AppError } from "../../shared/errors/app-error";

export class TransactionService {
  async create(data: CreateTransactionInput, companyId: string) {

    // ========================
    //  REGRA DE NEGÓCIO COMPLETA
    // ========================

    if (data.type === "INCOME") {
      if (!data.customerId) {
        throw new AppError("Customer is required for income", 400);
      }

      if (data.supplierId) {
        throw new AppError("Income cannot have supplier", 400);
      }
    }

    if (data.type === "EXPENSE") {
      if (!data.supplierId) {
        throw new AppError("Supplier is required for expense", 400);
      }

      if (data.customerId) {
        throw new AppError("Expense cannot have customer", 400);
      }
    }
    // ========================
    //  VALIDAÇÃO MULTI-TENANT
    // ========================

    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, companyId }
    });

    if (!category) {
      throw new AppError("Invalid category", 400);
    }

    const account = await prisma.financialAccount.findFirst({
      where: { id: data.accountId, companyId }
    });

    if (!account) {
      throw new AppError("Invalid account", 400);
    }

    // valida customer
    if (data.customerId) {
      const customer = await prisma.customer.findFirst({
        where: { id: data.customerId, companyId }
      });

      if (!customer) {
        throw new AppError("Invalid customer", 400);
      }
    }

    // valida supplier
    if (data.supplierId) {
      const supplier = await prisma.supplier.findFirst({
        where: { id: data.supplierId, companyId }
      });

      if (!supplier) {
        throw new AppError("Invalid supplier", 400);
      }
    }

    // ========================
    //  CREATE (sem quebrar seu padrão)
    // ========================

    const transaction = await prisma.transaction.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        dueDate: new Date(data.dueDate),

        categoryId: data.categoryId,
        accountId: data.accountId,
        companyId,

        customerId: data.customerId,
        supplierId: data.supplierId
      }
    });

    return {
      ...transaction,
      amount: Number(transaction.amount)
    };
  }

  async list(companyId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { companyId },
      include: {
        category: true,
        account: true,
        customer: true,
        supplier: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return transactions.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
      account: {
        ...tx.account,
        balance: Number(tx.account.balance)
      }
    }));
  }

  async pay(id: string, companyId: string) {
    return prisma.$transaction(async (tx) => {

      const transaction = await tx.transaction.findUnique({
        where: { id }
      });

      if (!transaction) {
        throw new AppError("Transaction not found", 404);
      }

      if (transaction.companyId !== companyId) {
        throw new AppError("Unauthorized", 403);
      }

      if (transaction.status === "PAID") {
        throw new AppError("Already paid", 400);
      }

      const amount = Number(transaction.amount);

      const value =
        transaction.type === "INCOME" ? amount : -amount;

      console.log("Atualizando saldo:", {
        accountId: transaction.accountId,
        value
      });

      await tx.financialAccount.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            increment: value
          }
        }
      });

      const updated = await tx.transaction.update({
        where: { id },
        data: {
          status: "PAID",
          paidAt: new Date()
        }
      });

      return {
        ...updated,
        amount
      };
    });
  }
}