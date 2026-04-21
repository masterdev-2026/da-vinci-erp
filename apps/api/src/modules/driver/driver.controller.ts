import { FastifyInstance } from "fastify";
import { DriverService } from "./driver.service";
import {
  createDriverSchema,
  updateDriverSchema
} from "./driver.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new DriverService();

export async function driverController(app: FastifyInstance) {
  // CREATE
  app.post(
    "/drivers",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createDriverSchema.parse(request.body);

      const driver = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(driver);
    }
  );

  // LIST
  app.get(
    "/drivers",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const drivers = await service.list(request.user.companyId);
      return reply.send(drivers);
    }
  );

  // GET BY ID
  app.get(
    "/drivers/:id",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const driver = await service.findById(
        request.params.id,
        request.user.companyId
      );

      return reply.send(driver);
    }
  );

  // UPDATE
  app.put(
    "/drivers/:id",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = updateDriverSchema.parse(request.body);

      const driver = await service.update(
        request.params.id,
        body,
        request.user.companyId
      );

      return reply.send(driver);
    }
  );

  // DELETE
  app.delete(
    "/drivers/:id",
    { preHandler: devAuth },
    async (request: any, reply) => {
      await service.delete(
        request.params.id,
        request.user.companyId
      );

      return reply.status(204).send();
    }
  );
}