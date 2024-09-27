/*
  Warnings:

  - You are about to drop the column `category_id` on the `back_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `item_stocks` on the `back_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `ls_id` on the `back_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `po_id` on the `back_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `unit_id` on the `back_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `ls_id` on the `item` table. All the data in the column will be lost.
  - You are about to drop the `location_shelf` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_order` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `back_inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `front_inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `back_inventory` DROP FOREIGN KEY `back_inventory_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `back_inventory` DROP FOREIGN KEY `back_inventory_ls_id_fkey`;

-- DropForeignKey
ALTER TABLE `back_inventory` DROP FOREIGN KEY `back_inventory_pd_id_fkey`;

-- DropForeignKey
ALTER TABLE `back_inventory` DROP FOREIGN KEY `back_inventory_po_id_fkey`;

-- DropForeignKey
ALTER TABLE `back_inventory` DROP FOREIGN KEY `back_inventory_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `item_ls_id_fkey`;

-- DropForeignKey
ALTER TABLE `processedpurchasedetails` DROP FOREIGN KEY `ProcessedPurchaseDetails_pd_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_details` DROP FOREIGN KEY `purchase_details_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_details` DROP FOREIGN KEY `purchase_details_po_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_details` DROP FOREIGN KEY `purchase_details_unit_id_fkey`;

-- AlterTable
ALTER TABLE `back_inventory` DROP COLUMN `category_id`,
    DROP COLUMN `item_stocks`,
    DROP COLUMN `ls_id`,
    DROP COLUMN `po_id`,
    DROP COLUMN `unit_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `pi_id` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `front_inventory` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `item` DROP COLUMN `ls_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `location_shelf`;

-- DropTable
DROP TABLE `purchase_details`;

-- DropTable
DROP TABLE `purchase_order`;

-- CreateTable
CREATE TABLE `employee` (
    `employee_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `middle_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`employee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_request` (
    `pr_id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `date_ordered` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`pr_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchased_item` (
    `pi_id` INTEGER NOT NULL AUTO_INCREMENT,
    `receipt_no` INTEGER NOT NULL,
    `purchase_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`pi_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchased_detail` (
    `pd_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pi_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_id` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `expiry_date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`pd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shelf_location` (
    `sl_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sl_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`sl_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_shelf` (
    `is_id` INTEGER NOT NULL AUTO_INCREMENT,
    `bd_id` INTEGER NOT NULL,
    `sl_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inventory_shelf_bd_id_sl_id_key`(`bd_id`, `sl_id`),
    PRIMARY KEY (`is_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `back_inventory` ADD CONSTRAINT `back_inventory_pi_id_fkey` FOREIGN KEY (`pi_id`) REFERENCES `purchased_item`(`pi_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `back_inventory` ADD CONSTRAINT `back_inventory_pd_id_fkey` FOREIGN KEY (`pd_id`) REFERENCES `purchased_detail`(`pd_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_request` ADD CONSTRAINT `purchase_request_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `item`(`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_request` ADD CONSTRAINT `purchase_request_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchased_detail` ADD CONSTRAINT `purchased_detail_pi_id_fkey` FOREIGN KEY (`pi_id`) REFERENCES `purchased_item`(`pi_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchased_detail` ADD CONSTRAINT `purchased_detail_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `item`(`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchased_detail` ADD CONSTRAINT `purchased_detail_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`unit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProcessedPurchaseDetails` ADD CONSTRAINT `ProcessedPurchaseDetails_pd_id_fkey` FOREIGN KEY (`pd_id`) REFERENCES `purchased_detail`(`pd_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_shelf` ADD CONSTRAINT `inventory_shelf_sl_id_fkey` FOREIGN KEY (`sl_id`) REFERENCES `shelf_location`(`sl_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_shelf` ADD CONSTRAINT `inventory_shelf_bd_id_fkey` FOREIGN KEY (`bd_id`) REFERENCES `back_inventory`(`bd_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
