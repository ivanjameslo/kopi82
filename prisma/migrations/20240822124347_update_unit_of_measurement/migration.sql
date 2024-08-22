/*
  Warnings:

  - Added the required column `unit` to the `back_inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `front_inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `purchase_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `back_inventory` ADD COLUMN `unit` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `front_inventory` ADD COLUMN `unit` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `purchase_details` ADD COLUMN `unit` VARCHAR(191) NOT NULL;
