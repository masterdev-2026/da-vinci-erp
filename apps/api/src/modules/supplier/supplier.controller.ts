import { FastifyInstance } from "fastify";
import { SupplierService } from "./supplier.service";
import {
  createSupplierSchema,
  updateSupplierSchema
} from "./supplier.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new SupplierService();

export async function supplierController(app: FastifyInstance) {

  app.post("/suppliers", { preHandler: devAuth }, async (req: any, res) => {
    const body = createSupplierSchema.parse(req.body);
    const data = await service.create(body, req.user.companyId);
    return res.send(data);
  });

  app.get("/suppliers", { preHandler: devAuth }, async (req: any, res) => {
    const data = await service.list(req.user.companyId);
    return res.send(data);
  });

  app.put("/suppliers/:id", { preHandler: devAuth }, async (req: any, res) => {
    const { id } = req.params;
    const body = updateSupplierSchema.parse(req.body);
    const data = await service.update(id, body, req.user.companyId);
    return res.send(data);
  });

  app.delete("/suppliers/:id", { preHandler: devAuth }, async (req: any, res) => {
    const { id } = req.params;
    await service.delete(id, req.user.companyId);
    return res.send({ ok: true });
  });
}