-- CreateEnum
CREATE TYPE "DiscountCodeType" AS ENUM ('PERCENTAGE', 'AMOUNT');

-- AlterTable
ALTER TABLE "DiscountCode" ADD COLUMN     "type" "DiscountCodeType" NOT NULL DEFAULT 'PERCENTAGE';
