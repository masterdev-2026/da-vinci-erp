import { FastifyInstance } from "fastify";
import { FleetDashboardService } from "./fleet-dashboard.service";
import { devAuth } from "../../middlewares/dev-auth";

const service = new FleetDashboardService();

export async function fleetDashboardController(app: FastifyInstance) {
  app.get(
    "/fleet/dashboard",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { startDate, endDate } = request.query as {
        startDate?: string;
        endDate?: string;
      };

      const data = await service.get(
        request.user.companyId,
        { startDate, endDate }
      );

      return reply.send(data);
    }
  );
}