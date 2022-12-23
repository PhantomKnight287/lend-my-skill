/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Gig` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `JobPost` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobPost" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Gig_slug_key" ON "Gig"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "JobPost_slug_key" ON "JobPost"("slug");
