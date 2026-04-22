import { prisma } from "@davinci/database";
import {
  CreateRequestInput,
  UpdateRequestInput
} from "./request.schema";

export class RequestService {
  async create(data: CreateRequestInput, companyId: string) {
    const employee = await prisma.employee.findFirst({
      where: {
        id: data.employeeId,
        companyId
      }
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    return prisma.request.create({
      data: {
        employeeId: data.employeeId,
        type: data.type,
        title: data.title,
        description: data.description,
        companyId
      }
    });
  }

  async list(companyId: string) {
    return prisma.request.findMany({
      where: { companyId },
      include: {
        employee: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async update(
    id: string,
    data: UpdateRequestInput,
    companyId: string
  ) {
    const request = await prisma.request.findFirst({
      where: {
        id,
        companyId
      }
    });

    if (!request) {
      throw new Error("Request not found");
    }

    return prisma.request.update({
      where: { id },
      data: {
        status: data.status,
        response: data.response
      }
    });
  }
}