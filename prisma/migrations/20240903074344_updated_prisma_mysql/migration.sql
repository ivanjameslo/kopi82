/*
  Warnings:

  - You are about to drop the column `category` on the `back_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `item_name` on the `back_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `location_shelf` on the `back_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `back_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `front_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `item_name` on the `purchase_details` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `purchase_details` table. All the data in the column will be lost.
  - Added the required column `item_id` to the `back_inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `purchase_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `back_inventory` DROP COLUMN `category`,
    DROP COLUMN `item_name`,
    DROP COLUMN `location_shelf`,
    DROP COLUMN `unit`,
    ADD COLUMN `item_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `front_inventory` DROP COLUMN `unit`;

-- AlterTable
ALTER TABLE `purchase_details` DROP COLUMN `item_name`,
    DROP COLUMN `unit`,
    ADD COLUMN `item_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `unit` (
    `unit_id` INTEGER NOT NULL AUTO_INCREMENT,
    `unit_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`unit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location_shelf` (
    `ls_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ls_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ls_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_name` VARCHAR(191) NOT NULL,
    `unit_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `ls_id` INTEGER NOT NULL,

    UNIQUE INDEX `item_unit_id_key`(`unit_id`),
    UNIQUE INDEX `item_category_id_key`(`category_id`),
    UNIQUE INDEX `item_ls_id_key`(`ls_id`),
    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `back_inventory` ADD CONSTRAINT `back_inventory_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `item`(`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_details` ADD CONSTRAINT `purchase_details_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `item`(`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item` ADD CONSTRAINT `item_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`unit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item` ADD CONSTRAINT `item_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item` ADD CONSTRAINT `item_ls_id_fkey` FOREIGN KEY (`ls_id`) REFERENCES `location_shelf`(`ls_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
