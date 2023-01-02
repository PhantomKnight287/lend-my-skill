/*
  Warnings:

  - You are about to drop the `Requirement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Requirement" DROP CONSTRAINT "Requirement_gigId_fkey";

-- DropTable
DROP TABLE "Requirement";
