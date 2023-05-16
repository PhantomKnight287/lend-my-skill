-- CreateTable
CREATE TABLE "ConversionRate" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversionRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConversionRate_id_key" ON "ConversionRate"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ConversionRate_to_key" ON "ConversionRate"("to");
