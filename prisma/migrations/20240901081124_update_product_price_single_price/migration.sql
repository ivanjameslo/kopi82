/*
  Warnings:

  - Added the required column `singlePrice` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `singlePrice` DOUBLE NOT NULL;
