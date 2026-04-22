-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Inspection" ADD COLUMN     "items" JSONB,
ADD COLUMN     "status" "InspectionStatus" NOT NULL DEFAULT 'PENDING';
