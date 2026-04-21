import { prisma } from "@davinci/database";
import { AppError } from "../../shared/errors/app-error";
import { CreateServiceOrderInput } from "./service-order.schema";

export class ServiceOrderService {

  async create(data: CreateServiceOrderInput, companyId: string) {

    // valida customer
    if (data.customerId) {
      const customer = await prisma.customer.findFirst({
        where: { id: data.customerId, companyId }
      });

      if (!customer) {
        throw new AppError("Invalid customer", 400);
      }
    }

    // valida partner
    if (data.partnerId) {
      const partner = await prisma.partner.findFirst({
        where: { id: data.partnerId, companyId }
      });

      if (!partner) {
        throw new AppError("Invalid partner", 400);
      }
    }

    return prisma.serviceOrder.create({
      data: {
        code: `OS-${Date.now()}`,
        title: data.title,
        value: data.value,

        scheduledAt: data.scheduledAt
          ? new Date(data.scheduledAt)
          : null,

        customerId: data.customerId,
        partnerId: data.partnerId,
        companyId
      }
    });
  }

  async list(companyId: string) {
    return prisma.serviceOrder.findMany({
      where: { companyId },
      include: {
        customer: true,
        partner: true
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async dashboard(companyId: string) {
    const orders = await prisma.serviceOrder.findMany({
      where: { companyId }
    });

    return {
      total: orders.length,
      open: orders.filter(o => o.status === "OPEN").length,
      inProgress: orders.filter(o => o.status === "IN_PROGRESS").length,
      done: orders.filter(o => o.status === "DONE").length
    };
  }

  async updateStatus(id: string, status: string, companyId: string) {

    const order = await prisma.serviceOrder.findFirst({
      where: { id, companyId }
    });

    if (!order) {
      throw new AppError("Service order not found", 404);
    }

    const data: any = { status };

    if (status === "IN_PROGRESS") {
      data.startedAt = new Date();
    }

    if (status === "DONE") {
      data.finishedAt = new Date();
    }

    return prisma.serviceOrder.update({
      where: { id },
      data
    });
  }
}