/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_serviceId_fkey";

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "serviceId";

-- CreateTable
CREATE TABLE "_ServiceToTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ServiceToTags_AB_unique" ON "_ServiceToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ServiceToTags_B_index" ON "_ServiceToTags"("B");

-- AddForeignKey
ALTER TABLE "_ServiceToTags" ADD CONSTRAINT "_ServiceToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToTags" ADD CONSTRAINT "_ServiceToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
