import { FastifyRequest, FastifyReply } from "fastify";

export async function devAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.headers["x-user-id"];
  const companyId = request.headers["x-company-id"];

  if (!userId || !companyId) {
    return reply.status(401).send({
      error: "Unauthorized - missing headers"
    });
  }

  request.user = {
    id: String(userId),
    companyId: String(companyId)
  };
}