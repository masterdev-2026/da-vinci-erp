import { FastifyInstance } from "fastify";
import { LeaveService } from "./leave.service";
import {
  createLeaveSchema,
  updateLeaveStatusSchema
} from "./leave.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new LeaveService();

export async function leaveController(app: FastifyInstance) {
  app.post(
    "/leaves",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createLeaveSchema.parse(request.body);

      const data = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.get(
    "/leaves",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.list(
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.patch(
    "/leaves/:id/status",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { id } = request.params as { id: string };
      const body = updateLeaveStatusSchema.parse(request.body);

      const data = await service.updateStatus(
        id,
        body,
        request.user.companyId
      );

      return reply.send(data);
    }
  );
}