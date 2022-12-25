/*
  Warnings:

  - You are about to drop the column `price` on the `JobPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "price",
ADD COLUMN     "budget" INTEGER;
