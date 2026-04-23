import { FastifyInstance } from "fastify";
import { MaintenanceService } from "./maintenance.service";
import { createMaintenanceSchema } from "./maintenance.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new MaintenanceService();

export async function maintenanceController(app: FastifyInstance) {
  // CREATE
  app.post(
    "/maintenances",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createMaintenanceSchema.parse(request.body);

      const maintenance = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(maintenance);
    }
  );

  // 🔧 LISTA GERAL
  app.get(
    "/maintenances",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { type } = request.query as {
        type?: "PREVENTIVE" | "CORRECTIVE";
      };

      const data = await service.list(
        request.user.companyId,
        type
      );

      return reply.send(data);
    }
  );

  //  REVISÕES (ATALHO UI)
  app.get(
    "/maintenances/preventive",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.list(
        request.user.companyId,
        "PREVENTIVE"
      );

      return reply.send(data);
    }
  );

  //  MANUTENÇÕES
  app.get(
    "/maintenances/corrective",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.list(
        request.user.companyId,
        "CORRECTIVE"
      );

      return reply.send(data);
    }
  );
}