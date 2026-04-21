import { FastifyInstance } from "fastify";
import { ServiceOrderService } from "./service-order.service";
import {
  createServiceOrderSchema,
  updateStatusSchema
} from "./service-order.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new ServiceOrderService();

export async function serviceOrderController(app: FastifyInstance) {

  app.post("/os", { preHandler: devAuth }, async (req: any, reply) => {
    const body = createServiceOrderSchema.parse(req.body);

    const data = await service.create(
      body,
      req.user.companyId
    );

    return reply.send(data);
  });

  app.get("/os", { preHandler: devAuth }, async (req: any, reply) => {
    const data = await service.list(req.user.companyId);
    return reply.send(data);
  });

  app.get("/os/dashboard", { preHandler: devAuth }, async (req: any, reply) => {
    const data = await service.dashboard(req.user.companyId);
    return reply.send(data);
  });

  app.patch("/os/:id/status", { preHandler: devAuth }, async (req: any, reply) => {
    const { id } = req.params;
    const body = updateStatusSchema.parse(req.body);

    const data = await service.updateStatus(
      id,
      body.status,
      req.user.companyId
    );

    return reply.send(data);
  });
}