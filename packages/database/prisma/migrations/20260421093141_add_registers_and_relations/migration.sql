-- CreateEnum
CREATE TYPE "NetworkStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- DropIndex
DROP INDEX "Category_companyId_idx";

-- DropIndex
DROP INDEX "Contract_driverId_idx";

-- DropIndex
DROP INDEX "Contract_startDate_idx";

-- DropIndex
DROP INDEX "FinancialAccount_companyId_idx";

-- DropIndex
DROP INDEX "License_expiresAt_idx";

-- DropIndex
DROP INDEX "Transaction_accountId_idx";

-- DropIndex
DROP INDEX "Transaction_categoryId_idx";

-- DropIndex
DROP INDEX "Transaction_companyId_idx";

-- DropIndex
DROP INDEX "Transaction_dueDate_idx";

-- DropIndex
DROP INDEX "Transaction_status_idx";

-- AlterTable
ALTER TABLE "ServiceOrder" ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "partnerId" TEXT,
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkLink" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "status" "NetworkStatus" NOT NULL DEFAULT 'ACTIVE',
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NetworkLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Partner_companyId_idx" ON "Partner"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkLink_companyId_partnerId_key" ON "NetworkLink"("companyId", "partnerId");

-- AddForeignKey
ALTER TABLE "ServiceOrder" ADD CONSTRAINT "ServiceOrder_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkLink" ADD CONSTRAINT "NetworkLink_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkLink" ADD CONSTRAINT "NetworkLink_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
