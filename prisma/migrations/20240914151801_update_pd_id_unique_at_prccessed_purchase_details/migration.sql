/*
  Warnings:

  - A unique constraint covering the columns `[pd_id]` on the table `ProcessedPurchaseDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ProcessedPurchaseDetails_pd_id_key` ON `ProcessedPurchaseDetails`(`pd_id`);
