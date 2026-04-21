import { prisma } from "@davinci/database";
import {
  CreateCompanyInput,
  UpdateCompanyInput
} from "./company.schema";

export class CompanyService {
  async create(data: CreateCompanyInput) {
    return prisma.company.create({
      data
    });
  }

  async list() {
    return prisma.company.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string) {
    const company = await prisma.company.findUnique({
      where: { id }
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  }

  async update(id: string, data: UpdateCompanyInput) {
    await this.findById(id);

    return prisma.company.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    await this.findById(id);

    return prisma.company.delete({
      where: { id }
    });
  }
}