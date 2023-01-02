-- AlterTable
ALTER TABLE "Features" ADD COLUMN     "gigId" TEXT;

-- AddForeignKey
ALTER TABLE "Features" ADD CONSTRAINT "Features_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
