/*
  Warnings:

  - You are about to drop the column `webtype` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_webtype_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "webtype";

-- DropEnum
DROP TYPE "WebType";

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
