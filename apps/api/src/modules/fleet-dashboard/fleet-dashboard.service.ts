import { prisma } from "@davinci/database";

type Filters = {
  startDate?: string;
  endDate?: string;
};

export class FleetDashboardService {
  async get(companyId: string, filters?: Filters) {
    const whereDate =
      filters?.startDate && filters?.endDate
        ? {
            createdAt: {
              gte: new Date(filters.startDate),
              lte: new Date(filters.endDate)
            }
          }
        : {};

    //  combustível
    const fuelTotal = await prisma.fuelLog.aggregate({
      where: {
        companyId,
        ...whereDate
      },
      _sum: { price: true }
    });

    // 🔧 manutenção
    const maintenanceTotal = await prisma.maintenance.aggregate({
      where: {
        companyId,
        ...whereDate
      },
      _sum: { cost: true }
    });

    //  multas pendentes
    const finesPending = await prisma.fine.aggregate({
      where: {
        companyId,
        status: "PENDING"
      },
      _sum: { amount: true }
    });

    //  veículos
    const vehicles = await prisma.vehicle.findMany({
      where: { companyId },
      include: {
        fuelLogs: true,
        maintenances: true,
        fines: true
      }
    });

    const vehicleStats = vehicles.map((v) => {
      const fuel = v.fuelLogs.reduce(
        (acc, f) => acc + Number(f.price),
        0
      );

      const maintenance = v.maintenances.reduce(
        (acc, m) => acc + Number(m.cost),
        0
      );

      const fines = v.fines.reduce(
        (acc, f) => acc + Number(f.amount),
        0
      );

      const totalCost = fuel + maintenance + fines;

      const totalKm = v.fuelLogs.reduce(
        (acc, f) => acc + f.km,
        0
      );

      const costPerKm =
        totalKm > 0 ? totalCost / totalKm : 0;

      return {
        vehicleId: v.id,
        plate: v.plate,
        totalCost,
        costPerKm
      };
    });

    //  TOP 5 MAIS CAROS
    const topVehicles = [...vehicleStats]
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 5);

    //  consumo médio
    const avgConsumption = await prisma.fuelLog.aggregate({
      where: {
        companyId,
        kmPerLiter: { not: null },
        ...whereDate
      },
      _avg: { kmPerLiter: true }
    });

    //  ALERTAS
    const alerts = {
      highCostVehicles: vehicleStats.filter(
        (v) => v.totalCost > 10000
      ),
      lowEfficiency: vehicleStats.filter(
        (v) => v.costPerKm > 5
      ),
      pendingFines: Number(finesPending._sum.amount || 0) > 0
    };

    const totalVehicles = await prisma.vehicle.count({
      where: { companyId }
    });

    return {
      summary: {
        totalVehicles,
        totalFuel: Number(fuelTotal._sum.price || 0),
        totalMaintenance: Number(maintenanceTotal._sum.cost || 0),
        totalFinesPending: Number(finesPending._sum.amount || 0),
        avgConsumption: Number(avgConsumption._avg.kmPerLiter || 0)
      },
      vehicles: vehicleStats,
      ranking: topVehicles,
      alerts
    };
  }
}