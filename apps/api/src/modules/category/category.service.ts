import { prisma } from "@davinci/database/src/client";
import { CreateCategoryInput } from "./category.schema";

export class CategoryService {
  async create(data: CreateCategoryInput, companyId: string) {
    return prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        companyId
      }
    });
  }

  async list(companyId: string) {
    return prisma.category.findMany({
      where: {
        companyId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}