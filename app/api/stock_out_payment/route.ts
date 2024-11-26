import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payment_id } = body;

    if (!payment_id) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    // Fetch payment details with orders and products
    const paymentDetails = await prisma.payment.findUnique({
      where: { payment_id },
      include: {
        order: {
          include: {
            order_details: {
              include: {
                product: {
                  include: {
                    ProductInventory: {
                      include: {
                        item: {
                          include: { category: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!paymentDetails) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Prepare items to stock out
    const itemsToStockOut: { bd_id: number; sl_id: number; quantity: number; unit_id: number; }[] = [];
    const validShelfLocations = ["Meat Prep", "Seafood Prep", "Pasta Corner"];

    for (const orderDetail of paymentDetails.order?.order_details || []) {
      const { product } = orderDetail;
      if (!product) continue;

      for (const inventory of product.ProductInventory || []) {
        const categoryName = inventory.item?.category?.category_name;

        if (["Meat", "Seafood", "Pasta"].includes(categoryName || "")) {
          // Fetch back_inventory entries for the item
          const backInventoryEntries = await prisma.back_inventory.findMany({
            where: {
              item_id: inventory.item.item_id,
              inventory_shelf: {
                some: {
                  shelf_location: { sl_name: { in: validShelfLocations } },
                  quantity: { gt: 0 },
                },
              },
            },
            include: {
              inventory_shelf: {
                where: {
                  shelf_location: { sl_name: { in: validShelfLocations } },
                  quantity: { gt: 0 },
                },
                include: { shelf_location: true },
              },
            },
            orderBy: { stock_in_date: "asc" },
          });

          let remainingQuantity = inventory.required_quantity * orderDetail.quantity;

          for (const entry of backInventoryEntries) {
            if (remainingQuantity === 0) break;

            for (const shelf of entry.inventory_shelf) {
              if (remainingQuantity === 0) break;

              const deductQuantity = Math.min(shelf.quantity, remainingQuantity);

              itemsToStockOut.push({
                bd_id: entry.bd_id,
                sl_id: shelf.sl_id,
                quantity: deductQuantity,
                unit_id: inventory.item.unit_id,
              });

              remainingQuantity -= deductQuantity;
            }
          }

          if (remainingQuantity > 0) {
            return NextResponse.json(
              { error: `Insufficient stock for item ${inventory.item.item_id}` },
              { status: 400 }
            );
          }
        }
      }
    }

    // Perform stock deduction and tracking
    await prisma.$transaction(async (prisma) => {
      for (const stockOut of itemsToStockOut) {
        const { bd_id, sl_id, quantity, unit_id } = stockOut;
    
        // Deduct quantity from the inventory shelf
        try {
          console.log(`Updating inventory shelf for bd_id ${bd_id}, sl_id ${sl_id}`);
          await prisma.inventory_shelf.update({
            where: { bd_id_sl_id: { bd_id, sl_id } },
            data: { quantity: { decrement: quantity } },
          });
          console.log(`Successfully updated inventory shelf for bd_id ${bd_id}, sl_id ${sl_id}`);
        } catch (error) {
          console.error(`Failed to update inventory shelf for bd_id ${bd_id}, sl_id ${sl_id}:`, error);
          throw error; // Ensure transaction rollback on failure
        }
    
        // Update back_inventory stock_used
        try {
          console.log(`Updating back_inventory for bd_id ${bd_id}`);
          await prisma.back_inventory.update({
            where: { bd_id },
            data: { stock_used: { increment: quantity } },
          });
          console.log(`Successfully updated back_inventory for bd_id ${bd_id}`);
        } catch (error) {
          console.error(`Failed to update back_inventory for bd_id ${bd_id}:`, error);
          throw error;
        }
    
        // Add inventory tracking log
        try {
          console.log(`Creating inventory tracking log for bd_id ${bd_id}, sl_id ${sl_id}`);
          await prisma.inventory_tracking.create({
            data: {
              bd_id,
              quantity,
              action: "used",
              payment_id,
              date_moved: new Date(),
              unit_id,
              source_shelf_id: sl_id,
              destination_shelf_id: null,
            },
          });
          console.log(`Successfully logged inventory movement for bd_id ${bd_id}, sl_id ${sl_id}`);
        } catch (error) {
          console.error(`Failed to log inventory tracking for bd_id ${bd_id}, sl_id ${sl_id}:`, error);
          throw error;
        }
      }
    });    

    return NextResponse.json({ success: true, message: "Stock-out completed successfully" });
  } catch (error: any) {
    console.error("Error processing stock-out by payment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
