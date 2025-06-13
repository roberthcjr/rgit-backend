/*
  Warnings:

  - You are about to drop the column `amount_in_cents` on the `Tool` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "amount_in_cents",
ADD COLUMN     "amount" TEXT;
