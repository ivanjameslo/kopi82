import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();  // Get the body of the request
        const { movements } = body;

        // Log the received movements to check the payload
        console.log("Received movements: ", movements);

        if (!movements || !Array.isArray(movements)) {
            return NextResponse.json({ error: "No movements provided or invalid format" }, { status: 400 });
        }

        for (const move of movements) {
            const { bd_id, source_sl_id, destination_sl_id, quantity, hidden, unit_id } = move;  // Ensure unit_id is included in the payload

            // Check source inventory with unit_id
            const sourceInventory = await prisma.inventory_shelf.findFirst({
                where: {
                    bd_id,
                    sl_id: source_sl_id,
                    unit_id,  // Match the unit as well
                },
            });

            if (!sourceInventory || sourceInventory.quantity < quantity) {
                return NextResponse.json({ error: `Invalid quantity for movement from shelf ${source_sl_id}` }, { status: 400 });
            }

            // Log the hidden value before making updates
            console.log(`Updating item with bd_id: ${bd_id}, hidden: ${hidden}`);

            // Case when the item is moved back to the same location but changes hidden status
            if (source_sl_id === destination_sl_id) {
                await prisma.inventory_shelf.update({
                    where: { is_id: sourceInventory.is_id },
                    data: {
                        quantity: sourceInventory.quantity + quantity,
                        hidden: false  // Ensure hidden updates correctly
                    },
                });
                continue;
            }

            // Find destination inventory with matching unit_id
            let destinationInventory = await prisma.inventory_shelf.findFirst({
                where: {
                    bd_id,
                    sl_id: destination_sl_id,
                    unit_id,  // Match the unit at the destination as well
                },
            });

            // If destination shelf exists, update its quantity
            if (destinationInventory) {
                await prisma.inventory_shelf.update({
                    where: { is_id: destinationInventory.is_id },
                    data: {
                        quantity: destinationInventory.quantity + quantity,
                    },
                });
            } else {
                // Create new inventory entry if destination doesn't exist
                await prisma.inventory_shelf.create({
                    data: {
                        bd_id,
                        sl_id: destination_sl_id,
                        quantity,
                        unit_id,  // Include unit_id in the new record
                    },
                });
            }

            // Update or hide the source shelf inventory after moving
            if (sourceInventory.quantity === quantity) {
                await prisma.inventory_shelf.update({
                    where: { is_id: sourceInventory.is_id },
                    data: {
                        quantity: 0,
                        hidden: true,
                    },
                });
            } else {
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
