/*
  Warnings:

  - You are about to drop the column `attachements` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "attachements",
ADD COLUMN     "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[];
