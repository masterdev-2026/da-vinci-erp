import { FastifyInstance } from "fastify";
import { CategoryService } from "./category.service";
import { createCategorySchema } from "./category.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new CategoryService();

export async function categoryController(app: FastifyInstance) {
  app.post(
    "/categories",
    { preHandler: devAuth },
    async (request, reply) => {
      const body = createCategorySchema.parse(request.body);

      const category = await service.create(
        body,
        request.user.companyId
      );

      return reply.send(category);
    }
  );

  app.get(
    "/categories",
    { preHandler: devAuth },
    async (request, reply) => {
      const categories = await service.list(
        request.user.companyId
      );

      return reply.send(categories);
    }
  );
}