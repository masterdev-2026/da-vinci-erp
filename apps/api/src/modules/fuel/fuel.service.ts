import { prisma } from "@davinci/database";
import { CreateFuelInput } from "./fuel.schema";

export class FuelService {
  async create(data: CreateFuelInput, companyId: string) {
    //  valida veículo
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: data.vehicleId,
        companyId
      }
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    //  busca último abastecimento
    const lastFuel = await prisma.fuelLog.findFirst({
      where: {
        vehicleId: data.vehicleId,
        companyId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    let kmPerLiter: number | null = null;

    if (lastFuel) {
      const kmDiff = data.km - lastFuel.km;

      if (kmDiff > 0) {
        kmPerLiter = kmDiff / data.liters;
      }
    }

    //  cria abastecimento
    const fuel = await prisma.fuelLog.create({
      data: {
        vehicleId: data.vehicleId,
        liters: data.liters,
        price: data.price,
        km: data.km,
        kmPerLiter,
        companyId
      }
    });

    //  INTEGRAÇÃO FINANCEIRA
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
        title: `Abastecimento veículo ${vehicle.plate}`,
        amount: data.price,
        type: "EXPENSE",
        dueDate: new Date(data.date),
        categoryId: category.id,
        accountId: account.id,
        companyId
      }
    });

    return fuel;
  }

  async list(companyId: string) {
    return prisma.fuelLog.findMany({
      where: { companyId },
      include: {
        vehicle: {
          select: {
            plate: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async dashboard(companyId: string) {
    const total = await prisma.fuelLog.count({
      where: { companyId }
    });

    const totalValue = await prisma.fuelLog.aggregate({
      where: { companyId },
      _sum: { price: true }
    });

    const avgConsumption = await prisma.fuelLog.aggregate({
      where: {
        companyId,
        kmPerLiter: { not: null }
      },
      _avg: { kmPerLiter: true }
    });

    return {
      total,
      totalValue: Number(totalValue._sum.price || 0),
      avgConsumption: Number(avgConsumption._avg.kmPerLiter || 0)
    };
  }

}