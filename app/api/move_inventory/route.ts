import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const inventoryMovement = await prisma.inventory_shelf.findMany({
            include: {
                shelf_location: {
                    select: {
                        sl_name: true,
                    },
                },
                back_inventory: {
                    select: {
                        bd_id: true,
                        purchased_detail: {
                            select: {
                                item: {
                                    select: {
                                        item_name: true,
                                    },
                                },
                                unit: {
                                    select: {
                                        unit_name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // Map the data to a format suitable for the frontend
        const data = inventoryMovement.map((movement) => ({
            bd_id: movement.back_inventory?.bd_id,
            item_name: movement.back_inventory?.purchased_detail?.item?.item_name || "Unknown",
            quantity: movement.quantity,
            date_moved: movement.updatedAt,
            shelf_location: {
                sl_name: movement.shelf_location.sl_name,
            },
            unit_name: movement.back_inventory?.purchased_detail?.unit?.unit_name || "units",
            action: "transfer",
        }));

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching inventory movement:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { movements } = body;

        console.log("Received movements: ", movements);

        if (!movements || !Array.isArray(movements)) {
            return NextResponse.json({ error: "No movements provided or invalid format" }, { status: 400 });
        }

        await prisma.$transaction(async (prisma) => {
            for (const move of movements) {
                const { bd_id, source_sl_id, destination_sl_id, quantity, hidden, unit_id } = move;

                // Find the source inventory
                const sourceInventory = await prisma.inventory_shelf.findFirst({
                    where: {
                        bd_id,
                        sl_id: source_sl_id,
                        unit_id,
                    },
                });

                if (!sourceInventory) {
                    throw new Error(`Source inventory not found for bd_id: ${bd_id}, sl_id: ${source_sl_id}, unit_id: ${unit_id}`);
                }

                if (sourceInventory.quantity < quantity) {
                    throw new Error(`Insufficient quantity in source shelf. Available: ${sourceInventory.quantity}, Requested: ${quantity}`);
                }

                console.log(`Moving item with bd_id: ${bd_id}, from shelf ${source_sl_id} to ${destination_sl_id}, quantity: ${quantity}`);

                // Update source inventory
                await prisma.inventory_shelf.update({
                    where: { is_id: sourceInventory.is_id },
                    data: {
                        quantity: sourceInventory.quantity - quantity,
                        hidden: sourceInventory.quantity === quantity ? true : sourceInventory.hidden,
                        // action: "transfer",
                    },
                });

                // Find or create destination inventory
                let destinationInventory = await prisma.inventory_shelf.findFirst({
                    where: {
                        bd_id,
                        sl_id: destination_sl_id,
                        unit_id,
                    },
                });

                if (destinationInventory) {
                    await prisma.inventory_shelf.update({
                        where: { is_id: destinationInventory.is_id },
                        data: {
                            quantity: destinationInventory.quantity + quantity,
                            hidden: false,
                            // action: "transfer",
                        },
                    });
                } else {
                    await prisma.inventory_shelf.create({
                        data: {
                            quantity,
                            hidden: false,
                            unit: { connect: { unit_id } },  // Connect the unit relation
                            shelf_location: { connect: { sl_id: destination_sl_id } },  // Use the relation for shelf_location
                            back_inventory: { connect: { bd_id } },  // Connect the back_inventory relation
                            // action: "transfer",
                        },
                    });                                      
                }
            }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Error moving inventory:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}