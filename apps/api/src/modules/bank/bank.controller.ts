import { FastifyInstance } from "fastify";
import { BankService } from "./bank.service";
import {
  createBankSchema,
  updateBankSchema
} from "./bank.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new BankService();

export async function bankController(app: FastifyInstance) {

  app.post("/banks", { preHandler: devAuth }, async (req: any, res) => {
    const body = createBankSchema.parse(req.body);
    const data = await service.create(body, req.user.companyId);
    return res.send(data);
  });

  app.get("/banks", { preHandler: devAuth }, async (req: any, res) => {
    const data = await service.list(req.user.companyId);
    return res.send(data);
  });

  app.put("/banks/:id", { preHandler: devAuth }, async (req: any, res) => {
    const { id } = req.params;
    const body = updateBankSchema.parse(req.body);
    const data = await service.update(id, body, req.user.companyId);
    return res.send(data);
  });

  app.delete("/banks/:id", { preHandler: devAuth }, async (req: any, res) => {
    const { id } = req.params;
    await service.delete(id, req.user.companyId);
    return res.send({ ok: true });
  });
}