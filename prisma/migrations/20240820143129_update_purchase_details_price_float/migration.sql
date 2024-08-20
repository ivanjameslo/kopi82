/*
  Warnings:

  - You are about to alter the column `price` on the `purchase_details` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `purchase_details` MODIFY `price` DOUBLE NOT NULL;
