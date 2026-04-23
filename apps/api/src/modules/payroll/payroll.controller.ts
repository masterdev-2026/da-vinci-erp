import { FastifyInstance } from "fastify";
import { PayrollService } from "./payroll.service";
import { createPayrollSchema, addItemSchema } from "./payroll.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new PayrollService();

export async function payrollController(app: FastifyInstance) {
  app.post("/payroll", { preHandler: devAuth }, async (req: any, res) => {
    const body = createPayrollSchema.parse(req.body);
    return res.send(await service.create(body, req.user.companyId));
  });

  app.post("/payroll/:id/item", { preHandler: devAuth }, async (req: any, res) => {
    const { id } = req.params;
    const body = addItemSchema.parse(req.body);
    return res.send(await service.addItem(id, body));
  });

  app.get("/payroll", { preHandler: devAuth }, async (req: any, res) => {
    return res.send(await service.list(req.user.companyId));
  });
}