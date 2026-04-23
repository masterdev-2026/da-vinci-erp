import Fastify from "fastify";
import cors from "@fastify/cors";
import { prisma } from "@davinci/database";

// controllers
import { categoryController } from "./modules/category/category.controller";
import { transactionController } from "./modules/transaction/transaction.controller";
import { accountController } from "./modules/account/account.controller";
import { financialController } from "./modules/financial/financial.controller";
import { driverController } from "./modules/driver/driver.controller";
import { companyController } from "./modules/company/company.controller";
import { licenseController } from "./modules/license/license.controller";
import { contractController } from "./modules/contract/contract.controller";
import { customerController } from "./modules/customer/customer.controller";
import { supplierController } from "./modules/supplier/supplier.controller";
import { bankController } from "./modules/bank/bank.controller";
import { reportController } from "./modules/report/report.controller";
import { serviceOrderController } from "./modules/service-order/service-order.controller";
import { networkController } from "./modules/network/network.controller";
import { vehicleController } from "./modules/vehicle/vehicle.controller";
import { maintenanceController } from "./modules/maintenance/maintenance.controller";
import { fuelController } from "./modules/fuel/fuel.controller";

// error
import { AppError } from "./shared/errors/app-error";
import { fineController } from "./modules/fine/fine.controller";
import { fleetDashboardController } from "./modules/fleet-dashboard/fleet-dashboard.controller";
import { inspectionController } from "./modules/inspection/inspection.controller";
import { employeeController } from "./modules/employee/employee.controller";
import { positionController } from "./modules/position/position.controller";
import { timeRecordController } from "./modules/time-record/time-record.controller";
import { overtimeController } from "./modules/overtime/overtime.controller";
import { vacationController } from "./modules/vacation/vacation.controller";
import { leaveController } from "./modules/leave/leave.controller";
import { requestController } from "./modules/request/request.controller";
import { equipmentController } from "./modules/equipment/equipment.controller";
import { recruitmentController } from "./modules/recruitment/recruitment.controller";
import { payrollController } from "./modules/payroll/payroll.controller";
import { hrDashboardController } from "./modules/hr-dashboard/hr-dashboard.controller";



async function start() {
  const app = Fastify();

  // ========================
  // PLUGINS
  // ========================

  await app.register(cors, {
    origin: true
  });

  // ========================
  // ERROR HANDLER (ANTES DAS ROTAS)
  // ========================

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message
      });
    }

    console.error(error);

    return reply.status(500).send({
      message: "Internal server error"
    });
  });

  // ========================
  // ROUTES
  // ========================

  await app.register(categoryController);
  await app.register(transactionController);
  await app.register(accountController);
  await app.register(financialController);
  await app.register(driverController);
  await app.register(companyController);
  await app.register(licenseController);
  await app.register(contractController);
  await app.register(customerController);
  await app.register(supplierController);
  await app.register(bankController);
  await app.register(reportController);
  await app.register(serviceOrderController);
  await app.register(networkController); 
  await app.register(vehicleController); 
  await app.register(maintenanceController); 
  await app.register(fuelController); 
  await app.register(fineController);
  await app.register(fleetDashboardController);
  await app.register(inspectionController);
  await app.register(employeeController);
  await app.register(positionController);
  await app.register(timeRecordController);
  await app.register(overtimeController);
  await app.register(vacationController);
  await app.register(leaveController);
  await app.register(requestController);
  await app.register(equipmentController);
  await app.register(recruitmentController);
  await app.register(payrollController);
  await app.register(hrDashboardController);


  // ========================
  // HEALTH
  // ========================

  app.get("/health", async () => {
    return { status: "ok" };
  });

  // ========================
  // TEST DB
  // ========================

  app.get("/test-db", async () => {
    const companies = await prisma.company.findMany();
    return companies;
  });

  // ========================
  // START
  // ========================

  await app.listen({ port: 3333 });

  console.log("API rodando em http://localhost:3333");
}

start();