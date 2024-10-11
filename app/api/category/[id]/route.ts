import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET method to fetch a category by ID or check if a category_name exists
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id
    const category = await prisma.category.findUnique({
        where: {
            category_id: Number(id)
        }
    });
    return NextResponse.json(category);
}

// PUT method to update a new category
export async function PUT(request: Request, { params }: { params: { id: string }}) {
    const id = params.id
    const json = await request.json()
    const updatedCategory = await prisma.category.update({
        where: {
            category_id: Number(id)
        },
        data: json
    })
    return NextResponse.json(updatedCategory);
}

// DELETE method to delete a category by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const deletedCategory = await prisma.category.delete({
        where: {
            category_id: parseInt(id, 10)
        }
    });

    return NextResponse.json(deletedCategory);
}