-- AlterTable
ALTER TABLE "Tags" ADD COLUMN     "serviceId" TEXT;

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL,
    "images" TEXT[],

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "deliveryDays" INTEGER NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "includedIn" TEXT[],
    "serviceId" TEXT,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FeatureToPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_id_key" ON "Service"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Package_id_key" ON "Package"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_id_key" ON "Feature"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_FeatureToPackage_AB_unique" ON "_FeatureToPackage"("A", "B");

-- CreateIndex
CREATE INDEX "_FeatureToPackage_B_index" ON "_FeatureToPackage"("B");

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToPackage" ADD CONSTRAINT "_FeatureToPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToPackage" ADD CONSTRAINT "_FeatureToPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
