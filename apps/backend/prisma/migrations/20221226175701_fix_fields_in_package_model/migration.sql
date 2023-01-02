/*
  Warnings:

  - You are about to drop the column `jobPostId` on the `Package` table. All the data in the column will be lost.
  - Added the required column `deliveryDays` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gigId` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_jobPostId_fkey";

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "jobPostId",
ADD COLUMN     "deliveryDays" INTEGER NOT NULL,
ADD COLUMN     "gigId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
