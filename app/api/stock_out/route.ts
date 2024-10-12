import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();  // Parse request body
        const { items } = body;

        // Check if items are provided
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "No items provided or invalid format" }, { status: 400 });
        }

        // Iterate through each item to update the stock
        for (const item of items) {
            const { bd_id, action, quantity } = item;

            // Fetch the back_inventory item with its associated inventory_shelf
            const backInventory = await prisma.back_inventory.findUnique({
                where: { bd_id },
                include: {
                    inventory_shelf: true,
                },
            });

            if (!backInventory) {
                return NextResponse.json({ error: `Back inventory with bd_id ${bd_id} not found` }, { status: 404 });
            }

            // Check if the quantity exceeds available stock
            const totalStock = backInventory.inventory_shelf.reduce((sum, shelf) => sum + shelf.quantity, 0);
            if (quantity > totalStock) {
                return NextResponse.json({ error: `Quantity exceeds available stock for bd_id ${bd_id}` }, { status: 400 });
            }

            // Update inventory_shelf based on the selected action (stock used or stock damaged)
            if (action === "used") {
                await prisma.back_inventory.update({
                    where: { bd_id },
                    data: {
                        stock_used: {
                            increment: quantity,
                        },
                        inventory_shelf: {
                            updateMany: {
                                where: {
                                    bd_id: backInventory.bd_id,
                                },
                                data: {
                                    quantity: {
                                        decrement: quantity,  // Reduce quantity
                                    },
                                },
                            },
                        },
                    },
                });
            } else if (action === "damaged") {
                await prisma.back_inventory.update({
                    where: { bd_id },
                    data: {
                        stock_damaged: {
                            increment: quantity,
                        },
                        inventory_shelf: {
                            updateMany: {
                                where: {
                                    bd_id: backInventory.bd_id,
                                },
                                data: {
                                    quantity: {
                                        decrement: quantity,  // Reduce quantity
                                    },
                                },
                            },
                        },
                    },
                });
            } else {
                return NextResponse.json({ error: "Invalid action provided" }, { status: 400 });
            }
        }

        return NextResponse.json({ success: true, message: "Stock out updated successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating stock out:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
