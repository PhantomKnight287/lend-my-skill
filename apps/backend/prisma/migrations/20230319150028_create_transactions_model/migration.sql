-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('UPIVerification', 'Payment');

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_id_key" ON "Transactions"("id");
