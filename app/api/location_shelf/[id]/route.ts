import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET method to fetch a location shelf by ID or check if a ls_name exists
export async function GET(request: NextRequest, { params }: { params: { id?: string, ls_name?: string } }) {
    const { id, ls_name } = params;

    if (id) {
        const ls = await prisma.location_shelf.findUnique({
            where: {
                ls_id: parseInt(id, 10)
            },
        });
        return NextResponse.json(ls);
    }

    if (ls_name) {
        const existingLS = await prisma.location_shelf.findUnique({
            where: {
                ls_name: ls_name
            }
        });
        return NextResponse.json({ exists: !!existingLS });
    }

    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
}

// POST method to create a new location shelf
export async function POST(request: NextRequest) {
    const json = await request.json();
    const { ls_name } = json;

    // Check if the ls_name already exists
    const existingLS = await prisma.location_shelf.findUnique({
        where: {
            ls_name: ls_name
        }
    });

    if (existingLS) {
        return NextResponse.json({ error: "Location Shelf name already exists" }, { status: 400 });
    }

    const newLS = await prisma.location_shelf.create({
        data: json
    });

    return NextResponse.json(newLS);
}

// PUT method to update an existing location shelf
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const json = await request.json();
    const { ls_name } = json;

    // Check if the ls_name already exists and it's not the current location shelf
    const existingLS = await prisma.location_shelf.findUnique({
        where: {
            ls_name: ls_name
        }
    });

    if (existingLS && existingLS.ls_id !== parseInt(id, 10)) {
        return NextResponse.json({ error: "Location Shelf name already exists" }, { status: 400 });
    }

    const updatedLS = await prisma.location_shelf.update({
        where: {
            ls_id: parseInt(id, 10)
        },
        data: json
    });

    return NextResponse.json(updatedLS);
}

// DELETE method to delete a location shelf by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const deletedLS = await prisma.location_shelf.delete({
        where: {
            ls_id: parseInt(id, 10)
        }
    });

    return NextResponse.json(deletedLS);
}