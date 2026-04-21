import { FastifyInstance } from "fastify";
import { ReportService } from "./report.service";
import { reportFilterSchema } from "./report.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new ReportService();

export async function reportController(app: FastifyInstance) {

  app.get(
    "/reports/general",
    { preHandler: devAuth },
    async (req: any, reply) => {
      const { startDate, endDate } = reportFilterSchema.parse(req.query);

      const data = await service.getGeneral(
        req.user.companyId,
        new Date(startDate),
        new Date(endDate)
      );

      return reply.send(data);
    }
  );

  app.get(
    "/reports/purchases",
    { preHandler: devAuth },
    async (req: any, reply) => {
      const { startDate, endDate } = reportFilterSchema.parse(req.query);

      const data = await service.getPurchases(
        req.user.companyId,
        new Date(startDate),
        new Date(endDate)
      );

      return reply.send(data);
    }
  );

  app.get(
    "/reports/top-categories",
    { preHandler: devAuth },
    async (req: any, reply) => {
      const { startDate, endDate } = reportFilterSchema.parse(req.query);

      const data = await service.getTopCategories(
        req.user.companyId,
        new Date(startDate),
        new Date(endDate)
      );

      return reply.send(data);
    }
  );
}