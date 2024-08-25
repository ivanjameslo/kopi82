/*
  Warnings:

  - You are about to drop the column `name` on the `back_inventory` table. All the data in the column will be lost.
  - Added the required column `item_name` to the `back_inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `back_inventory` DROP COLUMN `name`,
    ADD COLUMN `item_name` VARCHAR(191) NOT NULL;
