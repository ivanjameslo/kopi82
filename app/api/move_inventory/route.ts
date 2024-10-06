import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Assuming you have a prisma instance

export async function POST(request: NextRequest) {
    try {
        const { movements } = await request.json(); // Get the movements from the request body
        
        // Validate the movements array
        if (!movements || !Array.isArray(movements) || movements.length === 0) {
            return NextResponse.json({ error: "No movements provided or invalid format" }, { status: 400 });
        }

        // Process each movement
        for (const move of movements) {
            const { bd_id, source_sl_id, destination_sl_id, quantity } = move;

            // Fetch the current inventory for the original location
            const sourceInventory = await prisma.inventory_shelf.findFirst({
                where: {
                    bd_id,
                    sl_id: source_sl_id,
                },
            });

            if (!sourceInventory || sourceInventory.quantity < quantity) {
                return NextResponse.json({ error: `Invalid quantity for movement from shelf ${source_sl_id}` }, { status: 400 });
            }

            // Check if the destination already has an entry for this item
            let destinationInventory = await prisma.inventory_shelf.findFirst({
                where: {
                    bd_id,
                    sl_id: destination_sl_id,
                },
            });

            if (destinationInventory) {
                // If destination shelf already has this item, update the quantity
                await prisma.inventory_shelf.update({
                    where: { is_id: destinationInventory.is_id },
                    data: {
                        quantity: destinationInventory.quantity + quantity,
                    },
                });
            } else {
                // If destination shelf doesn't have this item, create a new entry
                await prisma.inventory_shelf.create({
                    data: {
                        bd_id,
                        sl_id: destination_sl_id,
                        quantity,
                    },
                });
            }

            // Update the original shelf by reducing the quantity
            if (sourceInventory.quantity === quantity) {
                // If all quantity is moved, mark the entry as hidden instead of deleting it
                await prisma.inventory_shelf.update({
                    where: { is_id: sourceInventory.is_id },
                    data: {
                        quantity: 0,  // Set the quantity to 0
                        hidden: true  // Mark as hidden (you would need to add this field in the database schema)
                    },
                });
            } else {
                // Otherwise, reduce the quantity
                await prisma.inventory_shelf.update({
                    where: { is_id: sourceInventory.is_id },
                    data: {
                        quantity: sourceInventory.quantity - quantity,
                    },
                });
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Error moving inventory:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
