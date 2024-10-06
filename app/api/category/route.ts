import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from the Purchase Details model
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.log("Error fetching categories", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST function to create a new Category
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    
    // Log the incoming request data for debugging
    console.log("Received request body:", res);

    const { category_name } = res;

    // Validate category_name input
    if (!category_name || typeof category_name !== 'string') {
      console.log("Invalid category_name:", category_name);
      return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
    }

    const normalizedCategoryName = category_name.toLowerCase();

    // Fetch all categories to perform a manual case-insensitive comparison
    const allCategories = await prisma.category.findMany();
    const existingCategory = allCategories.find(
      category => category.category_name.toLowerCase() === normalizedCategoryName
    );

    // Check if a category with the same normalized name exists
    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    // If no existing category, create a new one
    const created = await prisma.category.create({
      data: {
        category_name, // Save the category as it is, without lowering case
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Category", error);
    return NextResponse.json({ error: "Failed to create Category" }, { status: 500 });
  }
}
