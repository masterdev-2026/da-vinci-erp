import { FastifyInstance } from "fastify";
import { VehicleService } from "./vehicle.service";
import { createVehicleSchema } from "./vehicle.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new VehicleService();

export async function vehicleController(app: FastifyInstance) {
  app.post(
    "/vehicles",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createVehicleSchema.parse(request.body);

      const vehicle = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(vehicle);
    }
  );

  app.get(
    "/vehicles",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const vehicles = await service.list(
        request.user.companyId
      );

      return reply.send(vehicles);
    }
  );

  app.get(
    "/vehicles/:id",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { id } = request.params as { id: string };

      const vehicle = await service.getById(
        id,
        request.user.companyId
      );

      return reply.send(vehicle);
    }
  );

  app.delete(
    "/vehicles/:id",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { id } = request.params as { id: string };

      await service.delete(
        id,
        request.user.companyId
      );

      return reply.status(204).send();
    }
  );
}