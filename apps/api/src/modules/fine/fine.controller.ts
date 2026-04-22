import { FastifyInstance } from "fastify";
import { FineService } from "./fine.service";
import { createFineSchema } from "./fine.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new FineService();

export async function fineController(app: FastifyInstance) {
  app.post(
    "/fines",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createFineSchema.parse(request.body);

      const fine = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(fine);
    }
  );

  app.get(
    "/fines",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const fines = await service.list(
        request.user.companyId
      );

      return reply.send(fines);
    }
  );

  app.patch(
    "/fines/:id/pay",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { id } = request.params as { id: string };

      const fine = await service.pay(
        id,
        request.user.companyId
      );

      return reply.send(fine);
    }
  );

  app.get(
    "/fines/dashboard",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.dashboard(
        request.user.companyId
      );

      return reply.send(data);
    }
  );
}