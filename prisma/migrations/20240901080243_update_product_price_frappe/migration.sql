/*
  Warnings:

  - Added the required column `frappePrice` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `frappePrice` DOUBLE NOT NULL;
