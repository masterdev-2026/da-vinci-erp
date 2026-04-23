import { prisma } from "@davinci/database";
import { CreateFineInput } from "./fine.schema";

export class FineService {
  async create(data: CreateFineInput, companyId: string) {
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

    //  cria multa
    const fine = await prisma.fine.create({
      data: {
        vehicleId: data.vehicleId,
        code: data.code,
        description: data.description,
        amount: data.amount,
        companyId
      }
    });

    //  cria transação (PENDENTE)
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
        title: `Multa veículo ${vehicle.plate}`,
        amount: data.amount,
        type: "EXPENSE",
        dueDate: new Date(data.date),
        categoryId: category.id,
        accountId: account.id,
        companyId
      }
    });

    return fine;
  }

  async list(companyId: string) {
    return prisma.fine.findMany({
      where: { companyId },
      include: {
        vehicle: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async pay(id: string, companyId: string) {
    return prisma.$transaction(async (tx) => {
      const fine = await tx.fine.findUnique({
        where: { id }
      });

      if (!fine) {
        throw new Error("Fine not found");
      }

      if (fine.companyId !== companyId) {
        throw new Error("Unauthorized");
      }

      if (fine.status === "PAID") {
        throw new Error("Fine already paid");
      }

      //  atualizar saldo da conta
      const value = -Number(fine.amount);

      await tx.financialAccount.update({
        where: {
          id: (
            await tx.transaction.findFirst({
              where: { companyId }
            })
          )?.accountId
        },
        data: {
          balance: {
            increment: value
          }
        }
      });

      // marcar como pago
      const updated = await tx.fine.update({
        where: { id },
        data: {
          status: "PAID"
        }
      });

      return {
        ...updated,
        amount: Number(updated.amount)
      };
    });
  }

  async dashboard(companyId: string) {
  //  totais
  const total = await prisma.fine.count({
    where: { companyId }
  });

  const pending = await prisma.fine.aggregate({
    where: {
      companyId,
      status: "PENDING"
    },
    _sum: { amount: true }
  });

  const paid = await prisma.fine.aggregate({
    where: {
      companyId,
      status: "PAID"
    },
    _sum: { amount: true }
  });

  // veículo mais multado
  const vehicles = await prisma.vehicle.findMany({
    where: { companyId },
    include: {
      fines: true
    }
  });

  const mostFinedVehicle = vehicles
      .map((v) => ({
        plate: v.plate,
        total: v.fines.length
      }))
      .sort((a, b) => b.total - a.total)[0];

    return prisma.fine.findMany({
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

}