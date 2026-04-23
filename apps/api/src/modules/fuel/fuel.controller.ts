import { FastifyInstance } from "fastify";
import { FuelService } from "./fuel.service";
import { createFuelSchema } from "./fuel.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new FuelService();

export async function fuelController(app: FastifyInstance) {
  app.post(
    "/fuel",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createFuelSchema.parse(request.body);

      const fuel = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(fuel);
    }
  );

  app.get(
    "/fuel",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const fuels = await service.list(
        request.user.companyId
      );

      return reply.send(fuels);
    }
  );

  app.get(
    "/fuel/dashboard",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.dashboard(
        request.user.companyId
      );

      return reply.send(data);
    }
  );
}