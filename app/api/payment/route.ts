import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Order model
export async function GET(request: NextRequest) {
    try {
      const payment = await prisma.payment.findMany({
          select: {
              payment_id: true,
              payment_method: true,
              payment_status: true,
              // e-wallet
              reference_no: true,
              //otc
              amount: true,
              change: true,
              amount_paid: true,
              subtotal: true,
              finalAmount: true,
              discount: {
                  select: {
                      discount_id: true,
                      discount_name: true,
                      discount_rate: true,
                      status: true,
                  },
              },
              order: {
                  select: {
                      order_id: true,
                      customer_name: true,
                      service_type: true,
                      date: true,
                      order_details: {
                          select: {
                              orderDetails_id: true,
                              product: {
                                  select: {
                                      product_id: true,
                                      product_name: true,
                                      image_url: true,
                                  },
                              },
                              quantity: true,
                              price: true,
                          },
                      },
                  },
              },
              createdAt: true,
          },
      });
      return NextResponse.json(payment, {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
      console.error("Error fetching order details:", error);
      return NextResponse.json(
        { error: "Failed to fetch Order Details." },
        { status: 500 }
      );
    }
  }
  

// POST function to create a new payment
// export async function POST(request: NextRequest){
//     try{
//         const res = await request.json();
//         const {
//             payment_method,
//             payment_status,
//             reference_no,
//             account_number,
//             account_name,
//             cvv,
//             expiry_date,
//             amount,
//             change,
//             generated_code,
//             createdAt,
//         } = res;
//         console.log("Data to Insert:", res);
//         const created = await prisma.payment.create({
//             data: {
//                 payment_method,
//                 payment_status,
//                 reference_no,
//                 account_number,
//                 account_name,
//                 cvv,
//                 expiry_date,
//                 amount,
//                 change,
//                 generated_code,
//                 createdAt: new Date(createdAt)
//             },
//         });
//         return NextResponse.json(created, {status: 201})    
//     } catch (error) {
//         console.log("Error creating Payment", error);
//         return NextResponse.json(error, {status: 500});
//     }
// }


// POST function to create a new payment
export async function POST(request: NextRequest){
    try{
        const res = await request.json();
        const {
            payment_method,
            payment_status,
            reference_no,
            amount,
            change,
            amount_paid,
            subtotal,
            finalAmount,
            generated_code,
            createdAt,
            order_id,
            discount_id,
        } = res;
        console.log("Data to Insert:", res);
        const createdPayment = await prisma.payment.create({
            data: {
                payment_method,
                payment_status,
                reference_no,
                amount: parseFloat(amount),
                change: parseFloat(change),
                amount_paid: parseFloat(amount_paid),
                subtotal: parseFloat(subtotal),
                finalAmount: parseFloat(finalAmount),
                generated_code,
                createdAt: new Date(createdAt),
                order: {
                    connect: { order_id: parseInt(order_id) },
                },
                discount: discount_id
                    ? { connect: { discount_id: parseInt(discount_id) } }
                    : undefined,
            },
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
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if(!createdPayment.order) {
            return NextResponse.json(
                { error: "No associated order found for this payment." },
                { status: 400 }
            );
        }
        
        const itemsToStockOut: { bd_id: number; sl_id: number; quantity: number; unit_id: number; }[] = [];
        const validShelfLocations = ["Meat Prep", "Seafood Prep", "Pasta Corner"];

        for (const orderDetail of createdPayment.order.order_details || []) {
            const { product } = orderDetail;
            if (!product) continue;

            for (const inventory of product.ProductInventory || []) {
                const categoryName = inventory.item?.category?.category_name;

                if (["Meat", "Seafood", "Pasta"].includes(categoryName || "")) {
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
                        if (remainingQuantity <= 0) break;

                        for (const shelf of entry.inventory_shelf) {
                            if (remainingQuantity <= 0) break;

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

        await prisma.$transaction(async (prisma) => {
            for (const stockOut of itemsToStockOut) {
                const { bd_id, sl_id, quantity, unit_id } = stockOut;

                // Deduct quantity from inventory shelf
                await prisma.inventory_shelf.update({
                    where: { bd_id_sl_id: { bd_id, sl_id } },
                    data: { quantity: { decrement: quantity } },
                })

                // Update back_inventory stock_used
                await prisma.back_inventory.update({
                    where: { bd_id },
                    data: { stock_used: { increment: quantity } },
                });

                // Add inventory tracking log
                await prisma.inventory_tracking.create({
                    data: {
                        bd_id,
                        quantity,
                        action: "used",
                        payment_id: createdPayment.payment_id,
                        date_moved: new Date(),
                        unit_id,
                        source_shelf_id: sl_id,
                        destination_shelf_id: null,
                    },
                });
            }
        });
        return NextResponse.json(
            { success: true, message: "Payment created and stock-out processed successfully." },
            { status: 201 }
        );  
    } catch (error: any) {
        console.error("Error in Payment API:", error.message);
        return NextResponse.json(
        { error: "Failed to process payment", details: error.message },
        { status: 500 }
    );
    }
}