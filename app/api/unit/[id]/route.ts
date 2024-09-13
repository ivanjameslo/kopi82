import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET method to fetch a unit by ID or check if a unit_name exists
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id
    const unit = await prisma.unit.findUnique({
        where: {
            unit_id: Number(id)
        }
    });
    return NextResponse.json(unit);
}

// PUT method to update a new unit
export async function PUT(request: Request, { params }: { params: { id: string }}) {
    const id = params.id
    const json = await request.json()
    const updatedUnit = await prisma.unit.update({
        where: {
            unit_id: Number(id)
        },
        data: json
    })
    return NextResponse.json(updatedUnit);
}

// DELETE method to delete a unit by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const deletedUnit = await prisma.unit.delete({
        where: {
            unit_id: parseInt(id, 10)
        }
    });

    return NextResponse.json(deletedUnit);
}