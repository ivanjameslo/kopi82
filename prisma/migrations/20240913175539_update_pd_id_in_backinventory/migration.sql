-- AlterTable
ALTER TABLE `back_inventory` ADD COLUMN `pd_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `back_inventory` ADD CONSTRAINT `back_inventory_pd_id_fkey` FOREIGN KEY (`pd_id`) REFERENCES `purchase_details`(`pd_id`) ON DELETE SET NULL ON UPDATE CASCADE;
