import { prisma } from "@davinci/database";
import {
  CreateEmployeeInput,
  CreateAdmissionInput,
  CreateTerminationInput
} from "./employee.schema";
import { AuditService } from "../audit/audit.service";

const audit = new AuditService();

export class EmployeeService {
  async create(data: CreateEmployeeInput, companyId: string, userId?: string) {
    const position = await prisma.position.findFirst({
      where: {
        id: data.positionId,
        companyId
      }
    });

    if (!position) {
      throw new Error("Position not found");
    }

    const employee = await prisma.employee.create({
      data: {
        name: data.name,
        document: data.document,
        email: data.email,
        phone: data.phone,
        positionId: data.positionId,
        companyId
      }
    });

    // AUDITORIA
    await audit.log({
      userId,
      companyId,
      action: "CREATE_EMPLOYEE",
      entity: "Employee",
      entityId: employee.id,
      data
    });

    return employee;
  }

  async list(companyId: string) {
    return prisma.employee.findMany({
      where: { companyId },
      include: {
        position: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async admission(data: CreateAdmissionInput, companyId: string, userId?: string) {
    const employee = await prisma.employee.findFirst({
      where: {
        id: data.employeeId,
        companyId
      }
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    const admission = await prisma.admission.create({
      data: {
        employeeId: data.employeeId,
        date: new Date(data.date),
        salary: data.salary,
        companyId
      }
    });

    // AUDITORIA
    await audit.log({
      userId,
      companyId,
      action: "CREATE_ADMISSION",
      entity: "Admission",
      entityId: admission.id,
      data
    });

    return admission;
  }

  async termination(data: CreateTerminationInput, companyId: string, userId?: string) {
    const employee = await prisma.employee.findFirst({
      where: {
        id: data.employeeId,
        companyId
      }
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    await prisma.employee.update({
      where: { id: data.employeeId },
      data: {
        status: "INACTIVE"
      }
    });

    const termination = await prisma.termination.create({
      data: {
        employeeId: data.employeeId,
        date: new Date(data.date),
        reason: data.reason,
        companyId
      }
    });

    // AUDITORIA
    await audit.log({
      userId,
      companyId,
      action: "TERMINATE_EMPLOYEE",
      entity: "Termination",
      entityId: termination.id,
      data
    });

    return termination;
  }
}