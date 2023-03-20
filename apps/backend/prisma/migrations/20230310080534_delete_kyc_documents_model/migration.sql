/*
  Warnings:

  - You are about to drop the column `kycDocumentsId` on the `Uploads` table. All the data in the column will be lost.
  - You are about to drop the `KycDocuments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KycDocuments" DROP CONSTRAINT "KycDocuments_userId_fkey";

-- DropForeignKey
ALTER TABLE "Uploads" DROP CONSTRAINT "Uploads_kycDocumentsId_fkey";

-- AlterTable
ALTER TABLE "Uploads" DROP COLUMN "kycDocumentsId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kycDocuments" TEXT[];

-- DropTable
DROP TABLE "KycDocuments";
