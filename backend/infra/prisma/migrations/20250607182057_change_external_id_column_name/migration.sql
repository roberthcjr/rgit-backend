/*
  Warnings:

  - You are about to drop the column `externalId` on the `Tool` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "externalId",
ADD COLUMN     "external_id" TEXT;
