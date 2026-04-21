import { FastifyInstance } from "fastify";
import { ContractService } from "./contract.service";
import { createContractSchema } from "./contract.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new ContractService();

export async function contractController(app: FastifyInstance) {
  // ========================
  // CREATE
  // ========================
  app.post(
    "/contracts",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createContractSchema.parse(request.body);

      const contract = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(contract);
    }
  );

  // ========================
  // LIST
  // ========================
  app.get(
    "/contracts",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const contracts = await service.list(
        request.user.companyId
      );

      return reply.send(contracts);
    }
  );

  // ========================
  //  GERAR PARCELAS
  // ========================
  app.post(
    "/contracts/generate",
    { preHandler: devAuth },
    async (request: any, reply) => {
      await service.generateMonthlyTransactions(
        request.user.companyId
      );

      return reply.send({ ok: true });
    }
  );
}