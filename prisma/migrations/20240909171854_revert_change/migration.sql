-- DropForeignKey
ALTER TABLE `back_inventory` DROP FOREIGN KEY `back_inventory_pd_id_fkey`;

-- AlterTable
ALTER TABLE `back_inventory` ADD COLUMN `po_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `back_inventory` ADD CONSTRAINT `back_inventory_po_id_fkey` FOREIGN KEY (`po_id`) REFERENCES `purchase_order`(`po_id`) ON DELETE SET NULL ON UPDATE CASCADE;
