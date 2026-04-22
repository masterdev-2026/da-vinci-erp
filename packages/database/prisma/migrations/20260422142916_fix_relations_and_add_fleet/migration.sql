/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `FinancialAccount` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `License` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `NetworkLink` table. All the data in the column will be lost.
  - You are about to drop the column `linkedAt` on the `NetworkLink` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ServiceOrder` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "FineStatus" AS ENUM ('PENDING', 'PAID');

-- DropIndex
DROP INDEX "Bank_companyId_idx";

-- DropIndex
DROP INDEX "Category_name_companyId_key";

-- DropIndex
DROP INDEX "Contract_companyId_idx";

-- DropIndex
DROP INDEX "Driver_companyId_idx";

-- DropIndex
DROP INDEX "License_companyId_idx";

-- DropIndex
DROP INDEX "License_driverId_idx";

-- DropIndex
DROP INDEX "License_number_companyId_key";

-- DropIndex
DROP INDEX "NetworkLink_companyId_partnerId_key";

-- DropIndex
DROP INDEX "Partner_companyId_idx";

-- DropIndex
DROP INDEX "Permission_roleId_idx";

-- DropIndex
DROP INDEX "Role_companyId_idx";

-- DropIndex
DROP INDEX "ServiceOrder_companyId_idx";

-- DropIndex
DROP INDEX "ServiceOrder_status_idx";

-- DropIndex
DROP INDEX "User_companyId_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "createdAt",
DROP COLUMN "description";

-- AlterTable
ALTER TABLE "FinancialAccount" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "License" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "NetworkLink" DROP COLUMN "createdAt",
DROP COLUMN "linkedAt";

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "createdAt",
DROP COLUMN "document",
DROP COLUMN "email",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "ServiceOrder" DROP COLUMN "createdAt";

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'ACTIVE',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "type" "MaintenanceType" NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'PENDING',
    "vehicleId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelLog" (
    "id" TEXT NOT NULL,
    "liters" DOUBLE PRECISION NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "km" DOUBLE PRECISION NOT NULL,
    "kmPerLiter" DOUBLE PRECISION,
    "vehicleId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "FuelLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fine" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "FineStatus" NOT NULL DEFAULT 'PENDING',
    "vehicleId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Fine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL,
    "notes" TEXT,
    "vehicleId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_companyId_key" ON "Vehicle"("plate", "companyId");

-- CreateIndex
CREATE INDEX "Transaction_companyId_idx" ON "Transaction"("companyId");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelLog" ADD CONSTRAINT "FuelLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelLog" ADD CONSTRAINT "FuelLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
