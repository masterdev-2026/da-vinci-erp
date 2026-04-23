import { prisma } from "@davinci/database";
import { CreateMaintenanceInput } from "./maintenance.schema";

export class MaintenanceService {
  async create(data: CreateMaintenanceInput, companyId: string) {
    // valida veículo
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: data.vehicleId,
        companyId
      }
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // cria manutenção
    const maintenance = await prisma.maintenance.create({
      data: {
        type: data.type,
        description: data.description,
        cost: data.cost,
        vehicleId: data.vehicleId,
        companyId
      }
    });

    // INTEGRAÇÃO COM FINANCEIRO
    if (data.cost > 0) {
      const category = await prisma.category.findFirst({
        where: { companyId }
      });

      const account = await prisma.financialAccount.findFirst({
        where: { companyId }
      });

      if (!category || !account) {
        throw new Error("Category or account not found");
      }

      await prisma.transaction.create({
        data: {
          title: `Manutenção veículo ${vehicle.plate}`,
          amount: data.cost,
          type: "EXPENSE",
          dueDate: new Date(data.date),
          categoryId: category.id,
          accountId: account.id,
          companyId
        }
      });
    }

    return maintenance;
  }

  async list(companyId: string, type?: "PREVENTIVE" | "CORRECTIVE") {
    return prisma.maintenance.findMany({
      where: {
        companyId,
        ...(type && { type })
      },
      include: {
        vehicle: {
          select: {
            plate: true,
            model: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}