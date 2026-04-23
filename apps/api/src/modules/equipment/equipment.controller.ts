import { FastifyInstance } from "fastify";
import { EquipmentService } from "./equipment.service";
import {
  createEquipmentSchema,
  assignEquipmentSchema,
  returnEquipmentSchema
} from "./equipment.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new EquipmentService();

export async function equipmentController(app: FastifyInstance) {
  app.post(
    "/equipments",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createEquipmentSchema.parse(request.body);

      const data = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.get(
    "/equipments",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.list(
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.post(
    "/equipments/assign",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = assignEquipmentSchema.parse(request.body);

      const data = await service.assign(
        body,
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.patch(
    "/equipments/return/:id",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { id } = request.params as { id: string };
      const body = returnEquipmentSchema.parse(request.body);

      const data = await service.returnEquipment(
        id,
        body,
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.get(
    "/equipments/history",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.history(
        request.user.companyId
      );

      return reply.send(data);
    }
  );
}