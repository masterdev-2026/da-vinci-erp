import { prisma } from "@davinci/database";
import { AppError } from "../../shared/errors/app-error";
import {
  CreateCustomerInput,
  UpdateCustomerInput
} from "./customer.schema";

export class CustomerService {

  async create(data: CreateCustomerInput, companyId: string) {
    return prisma.customer.create({
      data: { ...data, companyId }
    });
  }

  async list(companyId: string) {
    return prisma.customer.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" }
    });
  }

  async update(id: string, data: UpdateCustomerInput, companyId: string) {
    const customer = await prisma.customer.findFirst({
      where: { id, companyId }
    });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    return prisma.customer.update({
      where: { id },
      data
    });
  }

  async delete(id: string, companyId: string) {
    const customer = await prisma.customer.findFirst({
      where: { id, companyId }
    });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    return prisma.customer.delete({
      where: { id }
    });
  }
}