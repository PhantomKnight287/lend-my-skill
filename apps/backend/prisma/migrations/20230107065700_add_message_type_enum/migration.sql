-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('BASIC', 'CONFIRM_AND_CANCEL_PROMT');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'BASIC';
