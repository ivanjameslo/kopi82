/*
  Warnings:

  - You are about to drop the `front_inventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "front_inventory" DROP CONSTRAINT "front_inventory_bd_id_fkey";

-- DropForeignKey
ALTER TABLE "front_inventory" DROP CONSTRAINT "front_inventory_product_id_fkey";

-- DropTable
DROP TABLE "front_inventory";
