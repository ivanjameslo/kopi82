/*
  Warnings:

  - You are about to drop the column `expiry_date` on the `back_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `back_inventory` table. All the data in the column will be lost.
  - Made the column `pd_id` on table `back_inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `back_inventory` DROP FOREIGN KEY `back_inventory_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `back_inventory` DROP FOREIGN KEY `back_inventory_pd_id_fkey`;

-- AlterTable
ALTER TABLE `back_inventory` DROP COLUMN `expiry_date`,
    DROP COLUMN `item_id`,
    MODIFY `pd_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `back_inventory` ADD CONSTRAINT `back_inventory_pd_id_fkey` FOREIGN KEY (`pd_id`) REFERENCES `purchased_detail`(`pd_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
