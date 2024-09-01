// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET (request: Request, { params } : { params  : { id: string}} ){
    const id = params.id
    const back_inventory = await prisma.back_inventory.findUnique({
        where: {
            bd_id: parseInt(id, 10)
        }
    });
    return NextResponse.json(back_inventory);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const json = await request.json();
    delete json.bd_id; // Ensure bd_id is not included in the data object

    // Convert po_id to an integer if it exists
    if (json.po_id) {
        json.po_id = parseInt(json.po_id, 10);
    }

    try {
        const updatedBackInventory = await prisma.back_inventory.update({
            where: {
                bd_id: parseInt(id, 10)
            },
            data: {
                item_name: json.item_name,
                item_stocks: json.item_stocks,
                unit: json.unit,
                category: json.category,
                location_shelf: json.location_shelf,
                stock_in_date: json.stock_in_date,
                expiry_date: json.expiry_date,
                stock_damaged: json.stock_damaged,
                purchase_order: {
                    connect: { po_id: json.po_id }
                }
            }
        });

        return NextResponse.json(updatedBackInventory);
    } catch (error) {
        console.error('Error updating back_inventory:', error);
        return NextResponse.json({ error: 'Failed to update back_inventory' }, { status: 500 });
    }
}

export async function DELETE (request: Request, { params } : { params : { id: string}}){
    const id = params.id;
    const deletedBackInventory = await prisma.back_inventory.delete({
        where: {
            bd_id: parseInt(id, 10)
        }
    })

    return NextResponse.json(deletedBackInventory);
}

// Remove the duplicate function definition
