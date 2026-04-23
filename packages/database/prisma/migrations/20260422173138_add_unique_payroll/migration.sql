/*
  Warnings:

  - You are about to drop the column `deductions` on the `Payroll` table. All the data in the column will be lost.
  - You are about to drop the column `overtimeAmount` on the `Payroll` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Payroll` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId,referenceMonth,referenceYear,companyId]` on the table `Payroll` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Payroll` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payroll_employeeId_referenceMonth_referenceYear_key";

-- AlterTable
ALTER TABLE "Payroll" DROP COLUMN "deductions",
DROP COLUMN "overtimeAmount",
DROP COLUMN "status",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Payroll_employeeId_idx" ON "Payroll"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_employeeId_referenceMonth_referenceYear_companyId_key" ON "Payroll"("employeeId", "referenceMonth", "referenceYear", "companyId");
