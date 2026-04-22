import { FastifyInstance } from "fastify";
import { EmployeeService } from "./employee.service";
import {
  createEmployeeSchema,
  createAdmissionSchema,
  createTerminationSchema
} from "./employee.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new EmployeeService();

export async function employeeController(app: FastifyInstance) {
  //  CREATE
  app.post(
    "/employees",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createEmployeeSchema.parse(request.body);

      const data = await service.create(
        body,
        request.user.companyId,
        request.user.id 
      );

      return reply.send(data);
    }
  );

  //  LIST
  app.get(
    "/employees",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const data = await service.list(request.user.companyId);
      return reply.send(data);
    }
  );

  //  ADMISSION
  app.post(
    "/employees/admission",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createAdmissionSchema.parse(request.body);

      const data = await service.admission(
        body,
        request.user.companyId,
        request.user.id 
      );

      return reply.send(data);
    }
  );

  // TERMINATION
  app.post(
    "/employees/termination",
    { preHandler: devAuth },
    async (request: any, reply) => {
      const body = createTerminationSchema.parse(request.body);

      const data = await service.termination(
        body,
        request.user.companyId,
        request.user.id 
      );

      return reply.send(data);
    }
  );
}