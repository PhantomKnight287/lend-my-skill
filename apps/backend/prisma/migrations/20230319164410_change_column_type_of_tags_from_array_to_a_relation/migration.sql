/*
  Warnings:

  - You are about to drop the column `tags` on the `JobPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "Tags" ADD COLUMN     "jobPostId" TEXT;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
