/*
  Warnings:

  - A unique constraint covering the columns `[unit_name]` on the table `unit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `unit_unit_name_key` ON `unit`(`unit_name`);
