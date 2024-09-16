import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET method to fetch a unit by ID or check if a unit_name exists
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id
    const item = await prisma.item.findUnique({
        where: {
            item_id: Number(id)
        }
    });
    return NextResponse.json(item);
}

// PUT method to update a new unit
export async function PUT(request: Request, { params }: { params: { id: string }}) {
    const id = params.id
    const json = await request.json()
    const updatedItem = await prisma.item.update({
        where: {
            item_id: Number(id)
        },
        data: json
    })
    return NextResponse.json(updatedItem);
}

// DELETE method to delete a unit by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const deletedItem = await prisma.item.delete({
        where: {
            item_id: parseInt(id, 10)
        }
    });

    return NextResponse.json(deletedItem);
}