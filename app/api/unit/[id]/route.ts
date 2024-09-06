import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET method to fetch a unit by ID or check if a unit_name exists
export async function GET(request: NextRequest, { params }: { params: { id?: string, unit_name?: string } }) {
    const { id, unit_name } = params;

    if (id) {
        const unit = await prisma.unit.findUnique({
            where: {
                unit_id: parseInt(id, 10)
            },
        });
        return NextResponse.json(unit);
    }

    if (unit_name) {
        const existingUnit = await prisma.unit.findUnique({
            where: {
                unit_name: unit_name
            }
        });
        return NextResponse.json({ exists: !!existingUnit });
    }

    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
}

// POST method to create a new unit
export async function POST(request: NextRequest) {
    const json = await request.json();
    const { unit_name } = json;

    // Check if the unit_name already exists
    const existingUnit = await prisma.unit.findUnique({
        where: {
            unit_name: unit_name
        }
    });

    if (existingUnit) {
        return NextResponse.json({ error: "Unit name already exists" }, { status: 400 });
    }

    const newUnit = await prisma.unit.create({
        data: json
    });

    return NextResponse.json(newUnit);
}

// PUT method to update an existing unit
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const json = await request.json();
    const { unit_name } = json;

    // Check if the unit_name already exists and it's not the current unit
    const existingUnit = await prisma.unit.findUnique({
        where: {
            unit_name: unit_name
        }
    });

    if (existingUnit && existingUnit.unit_id !== parseInt(id, 10)) {
        return NextResponse.json({ error: "Unit name already exists" }, { status: 400 });
    }

    const updatedUnit = await prisma.unit.update({
        where: {
            unit_id: parseInt(id, 10)
        },
        data: json
    });

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