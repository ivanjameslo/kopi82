/*
  Warnings:

  - Added the required column `supplier_id` to the `purchased_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchased_detail` ADD COLUMN `supplier_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `supplier` (
    `supplier_id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplier_name` VARCHAR(191) NOT NULL,
    `contact_no` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`supplier_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `purchased_detail` ADD CONSTRAINT `purchased_detail_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`supplier_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
