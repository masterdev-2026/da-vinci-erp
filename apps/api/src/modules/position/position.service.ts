import { prisma } from "@davinci/database";
import { CreatePositionInput } from "./position.schema";

export class PositionService {
  async create(data: CreatePositionInput, companyId: string) {
    const position = await prisma.position.create({
      data: {
        name: data.name,
        companyId
      }
    });

    return position;
  }

  async list(companyId: string) {
    return prisma.position.findMany({
      where: { companyId },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}