-- DropForeignKey
ALTER TABLE `front_inventory` DROP FOREIGN KEY `front_inventory_product_id_fkey`;

-- AlterTable
ALTER TABLE `front_inventory` MODIFY `product_id` INTEGER NULL,
    MODIFY `stock_in_date` DATETIME(3) NULL,
    MODIFY `stock_out_date` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `front_inventory` ADD CONSTRAINT `front_inventory_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE SET NULL ON UPDATE CASCADE;
