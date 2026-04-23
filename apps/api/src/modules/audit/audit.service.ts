import { prisma } from "@davinci/database";

export class AuditService {
  async log(params: {
    userId?: string;
    companyId: string;
    action: string;
    entity: string;
    entityId?: string;
    data?: any;
  }) {
    return prisma.auditLog.create({
      data: {
        userId: params.userId,
        companyId: params.companyId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        data: params.data
      }
    });
  }
}