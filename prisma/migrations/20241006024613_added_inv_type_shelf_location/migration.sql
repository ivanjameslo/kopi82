/*
  Warnings:

  - Added the required column `inv_type` to the `shelf_location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shelf_location` ADD COLUMN `inv_type` VARCHAR(191) NOT NULL;
