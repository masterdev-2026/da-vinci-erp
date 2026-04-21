import { prisma } from "@davinci/database";
import {
  CreateDriverInput,
  UpdateDriverInput
} from "./driver.schema";

export class DriverService {
  async create(data: CreateDriverInput, companyId: string) {
    return prisma.driver.create({
      data: {
        ...data,
        companyId
      }
    });
  }

  async list(companyId: string) {
    return prisma.driver.findMany({
      where: { companyId },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findById(id: string, companyId: string) {
    const driver = await prisma.driver.findFirst({
      where: {
        id,
        companyId
      }
    });

    if (!driver) {
      throw new Error("Driver not found");
    }

    return driver;
  }

  async update(
    id: string,
    data: UpdateDriverInput,
    companyId: string
  ) {
    await this.findById(id, companyId);

    return prisma.driver.update({
      where: { id },
      data
    });
  }

  async delete(id: string, companyId: string) {
    await this.findById(id, companyId);

    return prisma.driver.delete({
      where: { id }
    });
  }
}