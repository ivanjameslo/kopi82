/*
  Warnings:

  - Added the required column `category_id` to the `purchased_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchased_detail` ADD COLUMN `category_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `purchased_detail` ADD CONSTRAINT `purchased_detail_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
