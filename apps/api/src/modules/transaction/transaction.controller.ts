import { FastifyInstance } from "fastify";
import { TransactionService } from "./transaction.service";
import { createTransactionSchema } from "./transaction.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new TransactionService();

export async function transactionController(app: FastifyInstance) {

  // CREATE
  app.post(
    "/transactions",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createTransactionSchema.parse(request.body);

      const transaction = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(transaction);
    }
  );

  // LIST
  app.get(
    "/transactions",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const transactions = await service.list(
        request.user.companyId
      );

      return reply.send(transactions);
    }
  );

  // PAY
  app.patch(
    "/transactions/:id/pay",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const { id } = request.params as { id: string };

      const transaction = await service.pay(
        id,
        request.user.companyId
      );

      return reply.send(transaction);
    }
  );
}