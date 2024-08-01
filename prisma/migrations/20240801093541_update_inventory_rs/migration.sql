/*
  Warnings:

  - Made the column `bd_id` on table `front_inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `front_inventory` DROP FOREIGN KEY `front_inventory_bd_id_fkey`;

-- AlterTable
ALTER TABLE `front_inventory` MODIFY `bd_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `front_inventory` ADD CONSTRAINT `front_inventory_bd_id_fkey` FOREIGN KEY (`bd_id`) REFERENCES `back_inventory`(`bd_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
