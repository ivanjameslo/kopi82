/*
  Warnings:

  - Added the required column `supplier_id` to the `purchased_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "purchased_detail" DROP CONSTRAINT "purchased_detail_supplier_id_fkey";

-- AlterTable
ALTER TABLE "purchased_item" ADD COLUMN     "supplier_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "purchased_item" ADD CONSTRAINT "purchased_item_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;
