import { FastifyInstance } from "fastify";
import { RequestService } from "./request.service";
import {
  createRequestSchema,
  updateRequestSchema
} from "./request.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new RequestService();

export async function requestController(app: FastifyInstance) {
  app.post(
    "/requests",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createRequestSchema.parse(request.body);

      const data = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.get(
    "/requests",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.list(
        request.user.companyId
      );

      return reply.send(data);
    }
  );

  app.patch(
    "/requests/:id",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { id } = request.params as { id: string };
      const body = updateRequestSchema.parse(request.body);

      const data = await service.update(
        id,
        body,
        request.user.companyId
      );

      return reply.send(data);
    }
  );
}