-- DropForeignKey
ALTER TABLE `front_inventory` DROP FOREIGN KEY `front_inventory_bd_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_discount_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_p_method_eWallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_p_method_otc_id_fkey`;

-- AlterTable
ALTER TABLE `front_inventory` MODIFY `bd_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `order_id` INTEGER NULL,
    MODIFY `discount_id` INTEGER NULL,
    MODIFY `p_method_eWallet_id` INTEGER NULL,
    MODIFY `p_method_otc_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `front_inventory` ADD CONSTRAINT `front_inventory_bd_id_fkey` FOREIGN KEY (`bd_id`) REFERENCES `back_inventory`(`bd_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_discount_id_fkey` FOREIGN KEY (`discount_id`) REFERENCES `discount`(`discount_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_p_method_eWallet_id_fkey` FOREIGN KEY (`p_method_eWallet_id`) REFERENCES `payment_method_eWallet`(`p_method_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_p_method_otc_id_fkey` FOREIGN KEY (`p_method_otc_id`) REFERENCES `payment_method_otc`(`p_method_id`) ON DELETE SET NULL ON UPDATE CASCADE;
