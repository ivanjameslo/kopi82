import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "No items provided or invalid format" }, { status: 400 });
        }

        for (const item of items) {
            const { bd_id, action, quantity, sl_id } = item;

            const backInventory = await prisma.back_inventory.findUnique({
                where: { bd_id },
                include: {
                    inventory_shelf: true,
                },
            });

            if (!backInventory) {
                return NextResponse.json({ error: `Back inventory with bd_id ${bd_id} not found` }, { status: 404 });
            }

            const selectedShelf = backInventory.inventory_shelf.find(shelf => shelf.sl_id === parseInt(sl_id));
            if (!selectedShelf) {
                return NextResponse.json({ error: `Shelf location with sl_id ${sl_id} not found for bd_id ${bd_id}` }, { status: 404 });
            }

            if (quantity > selectedShelf.quantity) {
                return NextResponse.json({ error: `Quantity exceeds available stock for bd_id ${bd_id} in the selected location` }, { status: 400 });
            }

            if (action === "used") {
                await prisma.back_inventory.update({
                    where: { bd_id },
                    data: {
                        stock_used: {
                            increment: quantity,
                        },
                        stock_out_date: new Date(),
                        inventory_shelf: {
                            update: {
                                where: {
                                    bd_id_sl_id: {
                                        bd_id: backInventory.bd_id,
                                        sl_id: parseInt(sl_id),
                                    },
                                },
                                data: {
                                    quantity: {
                                        decrement: quantity,
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
                        stock_out_date: new Date(),
                        inventory_shelf: {
                            update: {
                                where: {
                                    bd_id_sl_id: {
                                        bd_id: backInventory.bd_id,
                                        sl_id: parseInt(sl_id),
                                    },
                                },
                                data: {
                                    quantity: {
                                        decrement: quantity,
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