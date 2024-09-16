/*
  Warnings:

  - You are about to drop the column `expiry_date` on the `back_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `pd_id` on the `back_inventory` table. All the data in the column will be lost.
  - Added the required column `stock_out_date` to the `back_inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_in_date` to the `front_inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_out_date` to the `front_inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `back_inventory_pd_id_fkey` ON `back_inventory`;

-- AlterTable
ALTER TABLE `back_inventory` DROP COLUMN `expiry_date`,
    DROP COLUMN `pd_id`,
    ADD COLUMN `stock_out_date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `front_inventory` ADD COLUMN `stock_in_date` DATETIME(3) NOT NULL,
    ADD COLUMN `stock_out_date` DATETIME(3) NOT NULL;
