/*
  Warnings:

  - Added the required column `freelancerId` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPost" ADD COLUMN     "claimed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "freelancerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
