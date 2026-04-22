import { FastifyInstance } from "fastify";
import { PositionService } from "./position.service";
import { createPositionSchema } from "./position.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new PositionService();

export async function positionController(app: FastifyInstance) {
  // CREATE
  app.post(
    "/positions",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createPositionSchema.parse(request.body);

      const position = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(position);
    }
  );

  // LIST
  app.get(
    "/positions",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const positions = await service.list(
        request.user.companyId
      );

      return reply.send(positions);
    }
  );
}