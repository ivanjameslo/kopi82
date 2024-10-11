import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET method to fetch a supplier by ID or check if a supplier_name exists
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id
    const supplier = await prisma.supplier.findUnique({
        where: {
            supplier_id: Number(id)
        }
    });
    return NextResponse.json(supplier);
}

// PUT method to update a new supplier
export async function PUT(request: Request, { params }: { params: { id: string }}) {
    const id = params.id
    const json = await request.json()
    const updatedSupplier = await prisma.supplier.update({
        where: {
            supplier_id: Number(id)
        },
        data: json
    })
    return NextResponse.json(updatedSupplier);
}

// DELETE method to delete a unit by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const deletedSupplier = await prisma.supplier.delete({
        where: {
            supplier_id: parseInt(id, 10)
        }
    });

    return NextResponse.json(deletedSupplier);
}