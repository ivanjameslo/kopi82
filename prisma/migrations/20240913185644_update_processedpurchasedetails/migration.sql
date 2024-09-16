-- CreateTable
CREATE TABLE `ProcessedPurchaseDetails` (
    `ppd_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pd_id` INTEGER NOT NULL,
    `processed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ppd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProcessedPurchaseDetails` ADD CONSTRAINT `ProcessedPurchaseDetails_pd_id_fkey` FOREIGN KEY (`pd_id`) REFERENCES `purchase_details`(`pd_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
