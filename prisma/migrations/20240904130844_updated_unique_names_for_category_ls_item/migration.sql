/*
  Warnings:

  - A unique constraint covering the columns `[category_name]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[item_name]` on the table `item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ls_name]` on the table `location_shelf` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `category_category_name_key` ON `category`(`category_name`);

-- CreateIndex
CREATE UNIQUE INDEX `item_item_name_key` ON `item`(`item_name`);

-- CreateIndex
CREATE UNIQUE INDEX `location_shelf_ls_name_key` ON `location_shelf`(`ls_name`);
