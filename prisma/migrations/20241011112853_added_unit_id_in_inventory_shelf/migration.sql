/*
  Warnings:

  - Added the required column `unit_id` to the `inventory_shelf` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inventory_shelf` ADD COLUMN `unit_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `inventory_shelf` ADD CONSTRAINT `inventory_shelf_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`unit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
