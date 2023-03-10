-- AlterTable
ALTER TABLE "Uploads" ADD COLUMN     "kycDocumentsId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "paypalEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "upiId" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "KycDocuments" (
    "id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "KycDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KycDocuments_id_key" ON "KycDocuments"("id");

-- AddForeignKey
ALTER TABLE "Uploads" ADD CONSTRAINT "Uploads_kycDocumentsId_fkey" FOREIGN KEY ("kycDocumentsId") REFERENCES "KycDocuments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycDocuments" ADD CONSTRAINT "KycDocuments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
