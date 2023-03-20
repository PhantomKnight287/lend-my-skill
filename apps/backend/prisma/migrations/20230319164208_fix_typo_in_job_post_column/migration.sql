/*
  Warnings:

  - You are about to drop the column `clientId` on the `JobPost` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JobPost" DROP CONSTRAINT "JobPost_clientId_fkey";

-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "clientId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
