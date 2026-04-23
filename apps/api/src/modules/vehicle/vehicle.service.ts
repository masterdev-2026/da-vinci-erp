import { prisma } from "@davinci/database";
import { CreateVehicleInput } from "./vehicle.schema";

export class VehicleService {
  async create(data: CreateVehicleInput, companyId: string) {
    //  evita duplicidade por empresa
    const exists = await prisma.vehicle.findFirst({
      where: {
        plate: data.plate,
        companyId
      }
    });

    if (exists) {
      throw new Error("Vehicle already exists");
    }

    return prisma.vehicle.create({
      data: {
        ...data,
        companyId
      }
    });
  }

  async list(companyId: string) {
    return prisma.vehicle.findMany({
      where: { companyId },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async getById(id: string, companyId: string) {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        companyId
      }
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    return vehicle;
  }

  async delete(id: string, companyId: string) {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        companyId
      }
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    return prisma.vehicle.delete({
      where: { id }
    });
  }
}