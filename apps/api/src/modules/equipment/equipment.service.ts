import { prisma } from "@davinci/database";
import {
  CreateEquipmentInput,
  AssignEquipmentInput,
  ReturnEquipmentInput
} from "./equipment.schema";

export class EquipmentService {
  async create(data: CreateEquipmentInput, companyId: string) {
    return prisma.equipment.create({
      data: {
        name: data.name,
        description: data.description,
        companyId
      }
    });
  }

  async list(companyId: string) {
    return prisma.equipment.findMany({
      where: { companyId },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async assign(data: AssignEquipmentInput, companyId: string) {
    const active = await prisma.equipmentAssignment.findFirst({
      where: {
        employeeId: data.employeeId,
        equipmentId: data.equipmentId,
        companyId,
        returnedAt: null
      }
    });

    if (active) {
      throw new Error("Equipment already assigned and not returned");
    }

    const equipment = await prisma.equipment.findFirst({
      where: {
        id: data.equipmentId,
        companyId
      }
    });

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    return prisma.equipmentAssignment.create({
      data: {
        employeeId: data.employeeId,
        equipmentId: data.equipmentId,
        deliveredAt: new Date(),
        companyId
      }
    });
  }

  async returnEquipment(
    id: string,
    data: ReturnEquipmentInput,
    companyId: string
  ) {
    const assignment = await prisma.equipmentAssignment.findFirst({
      where: {
        id,
        companyId
      }
    });

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    return prisma.equipmentAssignment.update({
      where: { id },
      data: {
        returnedAt: new Date(data.returnedAt)
      }
    });
  }

  async history(companyId: string) {
    return prisma.equipmentAssignment.findMany({
      where: { companyId },
      include: {
        employee: {
          select: { name: true }
        },
        equipment: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}