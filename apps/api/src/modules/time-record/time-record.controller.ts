import { FastifyInstance } from "fastify";
import { TimeRecordService } from "./time-record.service";
import { createTimeRecordSchema } from "./time-record.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new TimeRecordService();

export async function timeRecordController(app: FastifyInstance) {
  app.post(
    "/time-records",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createTimeRecordSchema.parse(request.body);

      const record = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(record);
    }
  );

  app.get(
    "/time-records",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const records = await service.list(
        request.user.companyId
      );

      return reply.send(records);
    }
  );
}