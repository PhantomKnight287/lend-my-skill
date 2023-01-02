-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "attachments" TEXT[],
ALTER COLUMN "isRequired" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Choices" (
    "id" TEXT NOT NULL,
    "choice" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Choices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Choices" ADD CONSTRAINT "Choices_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
