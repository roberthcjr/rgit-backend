-- CreateEnum
CREATE TYPE "Tool_Status" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'LENDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "surname" VARCHAR(100),
    "job" VARCHAR(50) NOT NULL,
    "section" VARCHAR(50) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "waste_rate" SMALLINT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "inserted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wastage" SMALLINT NOT NULL,
    "status" "Tool_Status" NOT NULL DEFAULT 'AVAILABLE',
    "categoryId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "bundleId" TEXT,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lend" (
    "id" TEXT NOT NULL,
    "lend_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "limit_date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" INTEGER NOT NULL,

    CONSTRAINT "Lend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lend" ADD CONSTRAINT "Lend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lend" ADD CONSTRAINT "Lend_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
