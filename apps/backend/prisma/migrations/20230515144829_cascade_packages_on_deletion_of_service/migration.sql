-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_serviceId_fkey";

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
