/*
  Warnings:

  - You are about to drop the column `expiry_date` on the `back_inventory` table. All the data in the column will be lost.
  - Added the required column `expiry_date` to the `purchase_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `back_inventory` DROP COLUMN `expiry_date`;

-- AlterTable
ALTER TABLE `purchase_details` ADD COLUMN `expiry_date` DATETIME(3) NOT NULL;
