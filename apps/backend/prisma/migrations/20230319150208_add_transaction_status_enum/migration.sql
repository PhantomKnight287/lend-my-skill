/*
  Warnings:

  - Changed the type of `status` on the `Transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Created', 'Captured', 'Refunded', 'Failed');

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL;
