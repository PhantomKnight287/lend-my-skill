/*
  Warnings:

  - You are about to drop the column `githubUsername` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `githubUsername` on the `Freelancer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "githubUsername",
ADD COLUMN     "githubId" TEXT;

-- AlterTable
ALTER TABLE "Freelancer" DROP COLUMN "githubUsername",
ADD COLUMN     "githubId" TEXT;
