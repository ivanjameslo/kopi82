/*
  Warnings:

  - You are about to drop the `purchase_request` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stock_used` to the `back_inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `purchase_request` DROP FOREIGN KEY `purchase_request_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_request` DROP FOREIGN KEY `purchase_request_item_id_fkey`;

-- AlterTable
ALTER TABLE `back_inventory` ADD COLUMN `stock_used` INTEGER NOT NULL;

-- DropTable
DROP TABLE `purchase_request`;
