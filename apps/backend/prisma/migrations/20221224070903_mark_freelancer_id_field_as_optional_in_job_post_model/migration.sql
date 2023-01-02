-- DropForeignKey
ALTER TABLE "JobPost" DROP CONSTRAINT "JobPost_freelancerId_fkey";

-- AlterTable
ALTER TABLE "JobPost" ALTER COLUMN "freelancerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
