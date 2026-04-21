import { prisma } from "@davinci/database";
import { AppError } from "../../shared/errors/app-error";
import {
  CreateBankInput,
  UpdateBankInput
} from "./bank.schema";

export class BankService {

  async create(data: CreateBankInput, companyId: string) {
    const exists = await prisma.bank.findFirst({
      where: { code: data.code, companyId }
    });

    if (exists) {
      throw new AppError("Bank already exists");
    }

    return prisma.bank.create({
      data: { ...data, companyId }
    });
  }

  async list(companyId: string) {
    return prisma.bank.findMany({
      where: { companyId },
      orderBy: { name: "asc" }
    });
  }

  async update(id: string, data: UpdateBankInput, companyId: string) {
    const bank = await prisma.bank.findFirst({
      where: { id, companyId }
    });

    if (!bank) {
      throw new AppError("Bank not found", 404);
    }

    return prisma.bank.update({
      where: { id },
      data
    });
  }

  async delete(id: string, companyId: string) {
    const bank = await prisma.bank.findFirst({
      where: { id, companyId }
    });

    if (!bank) {
      throw new AppError("Bank not found", 404);
    }

    return prisma.bank.delete({
      where: { id }
    });
  }
}