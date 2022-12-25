-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('TEXT', 'MULTIPLE_CHOICE', 'ATTACHMENT');

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "jobPostId" TEXT,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Features" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "gigId" TEXT,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answerType" "AnswerType" NOT NULL DEFAULT 'TEXT',
    "isRequired" BOOLEAN NOT NULL,
    "gigId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FeaturesToPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Package_id_key" ON "Package"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Features_id_key" ON "Features"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Requirement_name_key" ON "Requirement"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Question_question_key" ON "Question"("question");

-- CreateIndex
CREATE UNIQUE INDEX "_FeaturesToPackage_AB_unique" ON "_FeaturesToPackage"("A", "B");

-- CreateIndex
CREATE INDEX "_FeaturesToPackage_B_index" ON "_FeaturesToPackage"("B");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeaturesToPackage" ADD CONSTRAINT "_FeaturesToPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "Features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeaturesToPackage" ADD CONSTRAINT "_FeaturesToPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
