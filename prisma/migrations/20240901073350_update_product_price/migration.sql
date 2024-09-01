/*
  Warnings:

  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.
  - Added the required column `hotPrice` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icedPrice` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `price`,
    ADD COLUMN `hotPrice` DOUBLE NOT NULL,
    ADD COLUMN `icedPrice` DOUBLE NOT NULL;
