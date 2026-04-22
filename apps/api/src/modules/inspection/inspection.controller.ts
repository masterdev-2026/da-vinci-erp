import { FastifyInstance } from "fastify";
import { InspectionService } from "./inspection.service";
import { createInspectionSchema } from "./inspection.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new InspectionService();

export async function inspectionController(app: FastifyInstance) {
  // CREATE
  app.post(
    "/inspections",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createInspectionSchema.parse(request.body);

      const inspection = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(inspection);
    }
  );

  // LIST
  app.get(
    "/inspections",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const inspections = await service.list(
        request.user.companyId
      );

      return reply.send(inspections);
    }
  );

  // DASHBOARD
  app.get(
    "/inspections/dashboard",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.dashboard(
        request.user.companyId
      );

      return reply.send(data);
    }
  );
}