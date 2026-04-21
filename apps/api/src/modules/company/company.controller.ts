import { FastifyInstance } from "fastify";
import { CompanyService } from "./company.service";
import {
  createCompanySchema,
  updateCompanySchema
} from "./company.schema";

const service = new CompanyService();

export async function companyController(app: FastifyInstance) {
  app.post("/companies", async (request, reply) => {
    const body = createCompanySchema.parse(request.body);

    const company = await service.create(body);
    return reply.send(company);
  });

  app.get("/companies", async (_, reply) => {
    const companies = await service.list();
    return reply.send(companies);
  });

  app.get("/companies/:id", async (request: any, reply) => {
    const company = await service.findById(request.params.id);
    return reply.send(company);
  });

  app.put("/companies/:id", async (request: any, reply) => {
    const body = updateCompanySchema.parse(request.body);

    const company = await service.update(
      request.params.id,
      body
    );

    return reply.send(company);
  });

  app.delete("/companies/:id", async (request: any, reply) => {
    await service.delete(request.params.id);
    return reply.status(204).send();
  });
}