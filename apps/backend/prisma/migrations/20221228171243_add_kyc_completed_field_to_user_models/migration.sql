-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "kycCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Freelancer" ADD COLUMN     "kycCompleted" BOOLEAN NOT NULL DEFAULT false;
