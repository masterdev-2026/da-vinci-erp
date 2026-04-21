import { prisma } from "@davinci/database";
import { AppError } from "../../shared/errors/app-error";
import {
  CreateSupplierInput,
  UpdateSupplierInput
} from "./supplier.schema";

export class SupplierService {

  async create(data: CreateSupplierInput, companyId: string) {
    return prisma.supplier.create({
      data: { ...data, companyId }
    });
  }

  async list(companyId: string) {
    return prisma.supplier.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" }
    });
  }

  async update(id: string, data: UpdateSupplierInput, companyId: string) {
    const supplier = await prisma.supplier.findFirst({
      where: { id, companyId }
    });

    if (!supplier) {
      throw new AppError("Supplier not found", 404);
    }

    return prisma.supplier.update({
      where: { id },
      data
    });
  }

  async delete(id: string, companyId: string) {
    const supplier = await prisma.supplier.findFirst({
      where: { id, companyId }
    });

    if (!supplier) {
      throw new AppError("Supplier not found", 404);
    }

    return prisma.supplier.delete({
      where: { id }
    });
  }
}