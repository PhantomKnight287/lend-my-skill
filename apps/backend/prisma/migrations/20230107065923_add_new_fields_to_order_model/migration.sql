-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "markedAsDoneByClient" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "markedAsDoneByFreelancer" BOOLEAN NOT NULL DEFAULT false;
