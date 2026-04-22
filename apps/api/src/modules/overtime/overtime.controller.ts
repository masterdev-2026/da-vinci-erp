import { FastifyInstance } from "fastify";
import { OvertimeService } from "./overtime.service";
import { createOvertimeSchema } from "./overtime.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new OvertimeService();

export async function overtimeController(app: FastifyInstance) {
  app.post(
    "/overtime",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createOvertimeSchema.parse(request.body);

      const data = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.get(
    "/overtime",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.list(
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.get(
    "/overtime/:employeeId/balance",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { employeeId } = request.params;

      const data = await service.balance(
        employeeId,
        request.user.companyId
      );

      return reply.send(data);
    }
  );
}