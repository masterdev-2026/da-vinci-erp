-- CreateEnum
CREATE TYPE "OvertimeType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateTable
CREATE TABLE "OvertimeBank" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "type" "OvertimeType" NOT NULL,
    "referenceDate" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OvertimeBank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OvertimeBank_employeeId_idx" ON "OvertimeBank"("employeeId");

-- CreateIndex
CREATE INDEX "OvertimeBank_companyId_idx" ON "OvertimeBank"("companyId");

-- AddForeignKey
ALTER TABLE "OvertimeBank" ADD CONSTRAINT "OvertimeBank_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OvertimeBank" ADD CONSTRAINT "OvertimeBank_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
