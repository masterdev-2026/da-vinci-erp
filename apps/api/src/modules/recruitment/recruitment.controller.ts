import { FastifyInstance } from "fastify";
import { RecruitmentService } from "./recruitment.service";
import {
  createJobSchema,
  createCandidateSchema,
  applySchema,
  updateApplicationSchema
} from "./recruitment.schema";
import { devAuth } from "../../middlewares/dev-auth";

const service = new RecruitmentService();

export async function recruitmentController(app: FastifyInstance) {
  app.post("/jobs", { preHandler: devAuth }, async (req: any, res) => {
    const body = createJobSchema.parse(req.body);
    return res.send(await service.createJob(body, req.user.companyId));
  });

  app.get("/jobs", { preHandler: devAuth }, async (req: any, res) => {
    return res.send(await service.listJobs(req.user.companyId));
  });

  app.post("/candidates", { preHandler: devAuth }, async (req: any, res) => {
    const body = createCandidateSchema.parse(req.body);
    return res.send(await service.createCandidate(body, req.user.companyId));
  });

  app.get("/candidates", { preHandler: devAuth }, async (req: any, res) => {
    return res.send(await service.listCandidates(req.user.companyId));
  });

  app.post("/applications", { preHandler: devAuth }, async (req: any, res) => {
    const body = applySchema.parse(req.body);
    return res.send(await service.apply(body, req.user.companyId));
  });

  app.patch("/applications/:id", { preHandler: devAuth }, async (req: any, res) => {
    const { id } = req.params;
    const body = updateApplicationSchema.parse(req.body);
    return res.send(await service.updateApplication(id, body, req.user.companyId));
  });
}