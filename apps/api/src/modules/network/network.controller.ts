import { FastifyInstance } from "fastify";
import { NetworkService } from "./network.service";
import {
  createPartnerSchema,
  linkPartnerSchema
} from "./network.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new NetworkService();

export async function networkController(app: FastifyInstance) {

  app.post("/partners", { preHandler: devAuth }, async (req: any, reply) => {
    const body = createPartnerSchema.parse(req.body);

    const data = await service.createPartner(
      body,
      req.user.companyId
    );

    return reply.send(data);
  });

  app.post("/network/link", { preHandler: devAuth }, async (req: any, reply) => {
    const body = linkPartnerSchema.parse(req.body);

    const data = await service.linkPartner(
      body.partnerId,
      req.user.companyId
    );

    return reply.send(data);
  });

  app.get("/network", { preHandler: devAuth }, async (req: any, reply) => {
    const data = await service.list(req.user.companyId);
    return reply.send(data);
  });

  app.get("/network/dashboard", { preHandler: devAuth }, async (req: any, reply) => {
    const data = await service.dashboard(req.user.companyId);
    return reply.send(data);
  });
}