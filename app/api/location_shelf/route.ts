import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Details model
export async function GET(request: NextRequest) {
  const location_shelf = await prisma.location_shelf.findMany();
  console.log(location_shelf);
  return NextResponse.json(location_shelf);
}

// POST function to create a new Category
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { ls_name } = res;

    // Fetch all categories and filter manually in JavaScript (case-insensitive comparison)
    const existingLocationShelf = await prisma.location_shelf.findFirst({
      where: {
        ls_name: {
          equals: ls_name.toLowerCase(), // Normalize the input
        },
      },
    });

    // Check if a category with the same normalized name exists
    if (existingLocationShelf && existingLocationShelf.ls_name.toLowerCase() === ls_name.toLowerCase()) {
      return NextResponse.json({ error: "Location Shelf already exists" }, { status: 400 });
    }

    // If no existing category, create a new one
    const created = await prisma.location_shelf.create({
      data: {
        ls_name,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Location Shelf", error);
    return NextResponse.json({ error: "Failed to create Location Shelf" }, { status: 500 });
  }
}
