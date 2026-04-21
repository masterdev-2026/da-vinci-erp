-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('CNH', 'ANTT', 'OTHER');

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "type" "LicenseType" NOT NULL,
    "number" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "driverId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "License_driverId_idx" ON "License"("driverId");

-- CreateIndex
CREATE INDEX "License_companyId_idx" ON "License"("companyId");

-- CreateIndex
CREATE INDEX "License_expiresAt_idx" ON "License"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "License_number_companyId_key" ON "License"("number", "companyId");

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
