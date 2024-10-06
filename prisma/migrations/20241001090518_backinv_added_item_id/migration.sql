/*
  Warnings:

  - Added the required column `item_id` to the `back_inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `back_inventory` ADD COLUMN `item_id` INTEGER NOT NULL;
