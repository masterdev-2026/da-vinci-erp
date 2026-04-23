import { FastifyInstance } from "fastify";
import { FinancialService } from "./financial.service";
import { devAuth } from "../../middlewares/dev-auth";
import { createFinancialTransactionSchema } from "./financial.schema";

const service = new FinancialService();

export async function financialController(app: FastifyInstance) {

  // ========================
  // CONTAS A PAGAR
  // ========================
  app.get(
    "/financial/payables",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.getPayables(request.user.companyId);
      return reply.send(data);
    }
  );

  // ========================
  // CONTAS A RECEBER
  // ========================
  app.get(
    "/financial/receivables",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.getReceivables(request.user.companyId);
      return reply.send(data);
    }
  );

  // ========================
  // CONCILIAÇÃO
  // ========================
  app.get(
    "/financial/reconciliation",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.getReconciliation(request.user.companyId);
      return reply.send(data);
    }
  );

  // ========================
  // EXTRATO GERAL
  // ========================
  app.get(
    "/financial/statement",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.getStatement(request.user.companyId);
      return reply.send(data);
    }
  );

  // ========================
  // EXTRATO POR CONTA (ATM)
  // ========================
  app.get(
    "/financial/account/:accountId",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { accountId } = request.params;

      const data = await service.getAccountStatement(
        request.user.companyId,
        accountId
      );

      return reply.send(data);
    }
  );
}