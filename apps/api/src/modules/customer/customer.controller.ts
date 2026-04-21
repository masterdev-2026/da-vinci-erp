import { FastifyInstance } from "fastify";
import { CustomerService } from "./customer.service";
import {
  createCustomerSchema,
  updateCustomerSchema
} from "./customer.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new CustomerService();

export async function customerController(app: FastifyInstance) {

  app.post("/customers", { preHandler: devAuth }, async (req: any, res) => {
    const body = createCustomerSchema.parse(req.body);
    const data = await service.create(body, req.user.companyId);
    return res.send(data);
  });

  app.get("/customers", { preHandler: devAuth }, async (req: any, res) => {
    const data = await service.list(req.user.companyId);
    return res.send(data);
  });

  app.put("/customers/:id", { preHandler: devAuth }, async (req: any, res) => {
    const { id } = req.params;
    const body = updateCustomerSchema.parse(req.body);
    const data = await service.update(id, body, req.user.companyId);
    return res.send(data);
  });

  app.delete("/customers/:id", { preHandler: devAuth }, async (req: any, res) => {
    const { id } = req.params;
    await service.delete(id, req.user.companyId);
    return res.send({ ok: true });
  });
}