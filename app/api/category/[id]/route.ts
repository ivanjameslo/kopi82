import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET method to fetch a category by ID or check if a category_name exists
export async function GET(request: NextRequest, { params }: { params: { id?: string, category_name?: string } }) {
    const { id, category_name } = params;

    if (id) {
        const category = await prisma.category.findUnique({
            where: {
                category_id: parseInt(id, 10)
            },
        });
        return NextResponse.json(category);
    }

    if (category_name) {
        const existingCategory = await prisma.category.findUnique({
            where: {
                category_name: category_name
            }
        });
        return NextResponse.json({ exists: !!existingCategory});
    }

    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
}

// POST method to create a new category
export async function POST(request: NextRequest) {
    const json = await request.json();
    const { category_name } = json;

    // Check if the category_name already exists
    const existingCategory = await prisma.category.findUnique({
        where: {
            category_name: category_name
        }
    });

    if (existingCategory) {
        return NextResponse.json({ error: "Category name already exists" }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
        data: json
    });

    return NextResponse.json(newCategory);
}

// PUT method to update an existing category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const json = await request.json();
    const { category_name } = json;

    // Check if the category_name already exists and it's not the current category
    const existingCategory = await prisma.category.findUnique({
        where: {
            category_name: category_name
        }
    });

    if (existingCategory && existingCategory.category_id !== parseInt(id, 10)) {
        return NextResponse.json({ error: "Category name already exists" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
        where: {
            category_id: parseInt(id, 10)
        },
        data: json
    });

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