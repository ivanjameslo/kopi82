/*
  Warnings:

  - You are about to drop the column `p_method_id` on the `payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[p_method_eWallet_id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[p_method_otc_id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `p_method_eWallet_id` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `p_method_otc_id` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` DROP COLUMN `p_method_id`,
    ADD COLUMN `p_method_eWallet_id` INTEGER NOT NULL,
    ADD COLUMN `p_method_otc_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `payment_p_method_eWallet_id_key` ON `payment`(`p_method_eWallet_id`);

-- CreateIndex
CREATE UNIQUE INDEX `payment_p_method_otc_id_key` ON `payment`(`p_method_otc_id`);

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_p_method_eWallet_id_fkey` FOREIGN KEY (`p_method_eWallet_id`) REFERENCES `payment_method_eWallet`(`p_method_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_p_method_otc_id_fkey` FOREIGN KEY (`p_method_otc_id`) REFERENCES `payment_method_otc`(`p_method_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
