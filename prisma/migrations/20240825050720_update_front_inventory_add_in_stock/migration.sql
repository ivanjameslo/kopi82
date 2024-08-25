/*
  Warnings:

  - Added the required column `in_stock` to the `front_inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `front_inventory` ADD COLUMN `in_stock` INTEGER NOT NULL;
