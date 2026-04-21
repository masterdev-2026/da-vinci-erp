import { FastifyInstance } from "fastify";
import { AccountService } from "./account.service";
import { createAccountSchema } from "./account.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new AccountService();

export async function accountController(app: FastifyInstance) {
  app.post(
    "/accounts",
    { preHandler: devAuth },
    async (request, reply) => {
      const body = createAccountSchema.parse(request.body);

      const account = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(account);
    }
  );

  app.get(
    "/accounts",
    { preHandler: devAuth },
    async (request, reply) => {
      const accounts = await service.list(
        request.user.companyId
      );

      return reply.send(accounts);
    }
  );
}