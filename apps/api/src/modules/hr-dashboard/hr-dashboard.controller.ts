import { FastifyInstance } from "fastify";
import { HrDashboardService } from "./hr-dashboard.service";
import { devAuth } from "../../middlewares/dev-auth";

const service = new HrDashboardService();

export async function hrDashboardController(app: FastifyInstance) {
  app.get(
    "/hr-dashboard",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.get(request.user.companyId);
      return reply.send(data);
    }
  );
}