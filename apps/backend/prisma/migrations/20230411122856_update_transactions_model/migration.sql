/*
  Warnings:

  - Added the required column `createdByUserId` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "createdByUserId" TEXT NOT NULL,
ADD COLUMN     "paidToUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_paidToUserId_fkey" FOREIGN KEY ("paidToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
