/*
  Warnings:

  - You are about to drop the column `po_id` on the `back_inventory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `back_inventory` DROP FOREIGN KEY `back_inventory_po_id_fkey`;

-- AlterTable
ALTER TABLE `back_inventory` DROP COLUMN `po_id`;

-- AddForeignKey
ALTER TABLE `back_inventory` ADD CONSTRAINT `back_inventory_pd_id_fkey` FOREIGN KEY (`pd_id`) REFERENCES `purchase_details`(`pd_id`) ON DELETE SET NULL ON UPDATE CASCADE;
