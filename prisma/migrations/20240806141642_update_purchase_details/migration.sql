/*
  Warnings:

  - Added the required column `item_name` to the `purchase_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchase_details` ADD COLUMN `item_name` VARCHAR(191) NOT NULL;
