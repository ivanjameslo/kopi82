import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Details model
export async function GET(request: NextRequest) {
  const shelf_location = await prisma.shelf_location.findMany();
  console.log(shelf_location);
  return NextResponse.json(shelf_location);
}

// POST function to create a new Category
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { sl_name, inv_type } = res;

    // Fetch all categories and filter manually in JavaScript (case-insensitive comparison)
    const existingLocationShelf = await prisma.shelf_location.findFirst({
      where: {
        sl_name: {
          equals: sl_name,
          mode: 'insensitive', // Perform a case-insensitive comparison
        },
      },
    });

    // Check if a category with the same normalized name exists
    if (existingLocationShelf && existingLocationShelf.sl_name.toLowerCase() === sl_name.toLowerCase()) {
      return NextResponse.json({ error: "Location Shelf already exists" }, { status: 400 });
    }

    // If no existing category, create a new one
    const created = await prisma.shelf_location.create({
      data: {
        sl_name,
        inv_type,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Location Shelf", error);
    return NextResponse.json({ error: "Failed to create Location Shelf" }, { status: 500 });
  }
}
