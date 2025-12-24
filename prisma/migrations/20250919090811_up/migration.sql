/*
  Warnings:

  - You are about to drop the column `bestSeller` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `bestseller` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_sizeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_statusId_fkey";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "bestSeller",
DROP COLUMN "sizeId",
DROP COLUMN "statusId",
ADD COLUMN     "bestseller" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "public"."_ProductToSize" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductToSize_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductToSize_B_index" ON "public"."_ProductToSize"("B");

-- AddForeignKey
ALTER TABLE "public"."_ProductToSize" ADD CONSTRAINT "_ProductToSize_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProductToSize" ADD CONSTRAINT "_ProductToSize_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;
