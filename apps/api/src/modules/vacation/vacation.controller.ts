import { FastifyInstance } from "fastify";
import { VacationService } from "./vacation.service";
import {
  createVacationSchema,
  updateVacationStatusSchema
} from "./vacation.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new VacationService();

export async function vacationController(app: FastifyInstance) {
  app.post(
    "/vacations",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createVacationSchema.parse(request.body);

      const data = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.get(
    "/vacations",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.list(
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.patch(
    "/vacations/:id/status",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { id } = request.params as { id: string };
      const body = updateVacationStatusSchema.parse(request.body);

      const data = await service.updateStatus(
        id,
        body,
        request.user.companyId
      );

      return reply.send(data);
    }
  );
}