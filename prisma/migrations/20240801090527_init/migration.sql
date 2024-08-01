-- CreateTable
CREATE TABLE `back_inventory` (
    `bd_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `item_stocks` INTEGER NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `location_shelf` VARCHAR(191) NOT NULL,
    `stock_in_date` DATETIME(3) NOT NULL,
    `expiry_date` DATETIME(3) NOT NULL,
    `stock_damaged` INTEGER NOT NULL,

    PRIMARY KEY (`bd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `front_inventory` (
    `fd_id` INTEGER NOT NULL AUTO_INCREMENT,
    `bd_id` INTEGER NOT NULL,
    `stock_used` INTEGER NOT NULL,
    `stock_damaged` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,

    UNIQUE INDEX `front_inventory_bd_id_key`(`bd_id`),
    PRIMARY KEY (`fd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_order` (
    `po_id` INTEGER NOT NULL AUTO_INCREMENT,
    `receipt_no` INTEGER NOT NULL,
    `purchase_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`po_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_details` (
    `pd_id` INTEGER NOT NULL AUTO_INCREMENT,
    `po_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`pd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_name` VARCHAR(191) NOT NULL,
    `service_type` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_details` (
    `orderDetails_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`orderDetails_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `discount_id` INTEGER NOT NULL,
    `p_method_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `payment_order_id_key`(`order_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discount` (
    `discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    `discount_name` VARCHAR(191) NOT NULL,
    `discount_rate` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`discount_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_method_eWallet` (
    `p_method_id` INTEGER NOT NULL AUTO_INCREMENT,
    `mode` VARCHAR(191) NOT NULL,
    `reference_no` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`p_method_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_method_otc` (
    `p_method_id` INTEGER NOT NULL AUTO_INCREMENT,
    `mode` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `change` DOUBLE NOT NULL,

    PRIMARY KEY (`p_method_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_sales` (
    `sales_id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderDetails_id` INTEGER NOT NULL,
    `product_sold` INTEGER NOT NULL,
    `total_sales` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `product_sales_orderDetails_id_key`(`orderDetails_id`),
    PRIMARY KEY (`sales_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `front_inventory` ADD CONSTRAINT `front_inventory_bd_id_fkey` FOREIGN KEY (`bd_id`) REFERENCES `back_inventory`(`bd_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `front_inventory` ADD CONSTRAINT `front_inventory_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_details` ADD CONSTRAINT `purchase_details_po_id_fkey` FOREIGN KEY (`po_id`) REFERENCES `purchase_order`(`po_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_discount_id_fkey` FOREIGN KEY (`discount_id`) REFERENCES `discount`(`discount_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
