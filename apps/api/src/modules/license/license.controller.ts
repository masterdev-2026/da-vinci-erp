import { FastifyInstance } from "fastify";
import { LicenseService } from "./license.service";
import { createLicenseSchema } from "./license.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new LicenseService();

export async function licenseController(app: FastifyInstance) {
  app.post(
    "/licenses",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createLicenseSchema.parse(request.body);

      const license = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(license);
    }
  );

  app.get(
    "/licenses",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const licenses = await service.list(request.user.companyId);
      return reply.send(licenses);
    }
  );

  app.get(
    "/licenses/expiring",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const licenses = await service.getExpiring(
        request.user.companyId
      );

      return reply.send(licenses);
    }
  );
}