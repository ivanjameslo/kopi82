/*
  Warnings:

  - Added the required column `po_id` to the `back_inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `back_inventory` ADD COLUMN `po_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `back_inventory` ADD CONSTRAINT `back_inventory_po_id_fkey` FOREIGN KEY (`po_id`) REFERENCES `purchase_order`(`po_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
