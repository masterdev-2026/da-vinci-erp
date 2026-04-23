-- AlterTable
ALTER TABLE "Fine" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Fine_vehicleId_idx" ON "Fine"("vehicleId");

-- CreateIndex
CREATE INDEX "Fine_companyId_idx" ON "Fine"("companyId");
