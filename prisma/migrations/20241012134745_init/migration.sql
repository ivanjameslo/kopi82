-- CreateTable
CREATE TABLE "employee" (
    "employee_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "back_inventory" (
    "bd_id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "pd_id" INTEGER NOT NULL,
    "pi_id" INTEGER,
    "stock_in_date" TIMESTAMP(3),
    "stock_out_date" TIMESTAMP(3),
    "stock_damaged" INTEGER NOT NULL,
    "stock_used" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "back_inventory_pkey" PRIMARY KEY ("bd_id")
);

-- CreateTable
CREATE TABLE "front_inventory" (
    "fd_id" SERIAL NOT NULL,
    "bd_id" INTEGER NOT NULL,
    "in_stock" INTEGER NOT NULL,
    "stock_used" INTEGER NOT NULL,
    "stock_damaged" INTEGER NOT NULL,
    "stock_in_date" TIMESTAMP(3),
    "stock_out_date" TIMESTAMP(3),
    "product_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "front_inventory_pkey" PRIMARY KEY ("fd_id")
);

-- CreateTable
CREATE TABLE "purchased_item" (
    "pi_id" SERIAL NOT NULL,
    "receipt_no" INTEGER NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchased_item_pkey" PRIMARY KEY ("pi_id")
);

-- CreateTable
CREATE TABLE "purchased_detail" (
    "pd_id" SERIAL NOT NULL,
    "pi_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "expiry_date" TIMESTAMP(3),
    "supplier_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchased_detail_pkey" PRIMARY KEY ("pd_id")
);

-- CreateTable
CREATE TABLE "ProcessedPurchaseDetails" (
    "ppd_id" SERIAL NOT NULL,
    "pd_id" INTEGER NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedPurchaseDetails_pkey" PRIMARY KEY ("ppd_id")
);

-- CreateTable
CREATE TABLE "unit" (
    "unit_id" SERIAL NOT NULL,
    "unit_name" TEXT NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("unit_id")
);

-- CreateTable
CREATE TABLE "category" (
    "category_id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "shelf_location" (
    "sl_id" SERIAL NOT NULL,
    "sl_name" TEXT NOT NULL,
    "inv_type" TEXT NOT NULL,

    CONSTRAINT "shelf_location_pkey" PRIMARY KEY ("sl_id")
);

-- CreateTable
CREATE TABLE "inventory_shelf" (
    "is_id" SERIAL NOT NULL,
    "bd_id" INTEGER NOT NULL,
    "sl_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_shelf_pkey" PRIMARY KEY ("is_id")
);

-- CreateTable
CREATE TABLE "item" (
    "item_id" SERIAL NOT NULL,
    "item_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "supplier" (
    "supplier_id" SERIAL NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "contact_no" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "product" (
    "product_id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "hotPrice" DOUBLE PRECISION NOT NULL,
    "icedPrice" DOUBLE PRECISION NOT NULL,
    "frappePrice" DOUBLE PRECISION NOT NULL,
    "singlePrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "order" (
    "order_id" SERIAL NOT NULL,
    "customer_name" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "order_details" (
    "orderDetails_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("orderDetails_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "discount_id" INTEGER,
    "p_method_eWallet_id" INTEGER,
    "p_method_otc_id" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "discount" (
    "discount_id" SERIAL NOT NULL,
    "discount_name" TEXT NOT NULL,
    "discount_rate" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "discount_pkey" PRIMARY KEY ("discount_id")
);

-- CreateTable
CREATE TABLE "payment_method_eWallet" (
    "p_method_id" SERIAL NOT NULL,
    "mode" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,

    CONSTRAINT "payment_method_eWallet_pkey" PRIMARY KEY ("p_method_id")
);

-- CreateTable
CREATE TABLE "payment_method_otc" (
    "p_method_id" SERIAL NOT NULL,
    "mode" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "change" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "payment_method_otc_pkey" PRIMARY KEY ("p_method_id")
);

-- CreateTable
CREATE TABLE "product_sales" (
    "sales_id" SERIAL NOT NULL,
    "orderDetails_id" INTEGER NOT NULL,
    "product_sold" INTEGER NOT NULL,
    "total_sales" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_sales_pkey" PRIMARY KEY ("sales_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "front_inventory_bd_id_key" ON "front_inventory"("bd_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedPurchaseDetails_pd_id_key" ON "ProcessedPurchaseDetails"("pd_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_shelf_bd_id_sl_id_key" ON "inventory_shelf"("bd_id", "sl_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_order_id_key" ON "payment"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_p_method_eWallet_id_key" ON "payment"("p_method_eWallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_p_method_otc_id_key" ON "payment"("p_method_otc_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_sales_orderDetails_id_key" ON "product_sales"("orderDetails_id");

-- AddForeignKey
ALTER TABLE "back_inventory" ADD CONSTRAINT "back_inventory_pi_id_fkey" FOREIGN KEY ("pi_id") REFERENCES "purchased_item"("pi_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "back_inventory" ADD CONSTRAINT "back_inventory_pd_id_fkey" FOREIGN KEY ("pd_id") REFERENCES "purchased_detail"("pd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "front_inventory" ADD CONSTRAINT "front_inventory_bd_id_fkey" FOREIGN KEY ("bd_id") REFERENCES "back_inventory"("bd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "front_inventory" ADD CONSTRAINT "front_inventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_detail" ADD CONSTRAINT "purchased_detail_pi_id_fkey" FOREIGN KEY ("pi_id") REFERENCES "purchased_item"("pi_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_detail" ADD CONSTRAINT "purchased_detail_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_detail" ADD CONSTRAINT "purchased_detail_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_detail" ADD CONSTRAINT "purchased_detail_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_detail" ADD CONSTRAINT "purchased_detail_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessedPurchaseDetails" ADD CONSTRAINT "ProcessedPurchaseDetails_pd_id_fkey" FOREIGN KEY ("pd_id") REFERENCES "purchased_detail"("pd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_shelf" ADD CONSTRAINT "inventory_shelf_sl_id_fkey" FOREIGN KEY ("sl_id") REFERENCES "shelf_location"("sl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_shelf" ADD CONSTRAINT "inventory_shelf_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_shelf" ADD CONSTRAINT "inventory_shelf_bd_id_fkey" FOREIGN KEY ("bd_id") REFERENCES "back_inventory"("bd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discount"("discount_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_p_method_eWallet_id_fkey" FOREIGN KEY ("p_method_eWallet_id") REFERENCES "payment_method_eWallet"("p_method_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_p_method_otc_id_fkey" FOREIGN KEY ("p_method_otc_id") REFERENCES "payment_method_otc"("p_method_id") ON DELETE SET NULL ON UPDATE CASCADE;
