/*
  Warnings:

  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Cart";

-- CreateTable
CREATE TABLE "cart" (
    "cart_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "drink_type" TEXT NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("cart_id")
);

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
