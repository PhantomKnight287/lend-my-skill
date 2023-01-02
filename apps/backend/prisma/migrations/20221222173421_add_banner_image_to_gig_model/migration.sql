/*
  Warnings:

  - Added the required column `bannerImage` to the `Gig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "bannerImage" TEXT NOT NULL;
