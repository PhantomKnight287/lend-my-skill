/*
  Warnings:

  - You are about to drop the column `ratedBy` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "ratedBy",
DROP COLUMN "rating";
