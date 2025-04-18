-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_categoryId_fkey";

-- AlterTable
ALTER TABLE "Tool" ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "brandId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
