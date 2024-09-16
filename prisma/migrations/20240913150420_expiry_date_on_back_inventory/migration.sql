/*
  Warnings:

  - Added the required column `expiry_date` to the `back_inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `back_inventory` ADD COLUMN `expiry_date` DATETIME(3) NOT NULL;
