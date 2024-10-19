/*
  Warnings:

  - You are about to drop the column `supplier_id` on the `purchased_detail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "purchased_detail" DROP COLUMN "supplier_id";

-- AlterTable
ALTER TABLE "supplier" ALTER COLUMN "contact_no" DROP NOT NULL;
