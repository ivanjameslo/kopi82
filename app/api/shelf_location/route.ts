import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Details model
export async function GET(request: NextRequest) {

  try {
    const shelf_location = await prisma.shelf_location.findMany({
      select: {
        sl_id: true,
        sl_name: true,
        inv_type: true,
        inventory_shelf: true
      }
    });

    const data = shelf_location.map((location) => ({
      sl_id: location.sl_id,
      sl_name: location.sl_name,
      inv_type: location.inv_type,
      isUsed: location.inventory_shelf.length > 0,
    }));

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch supplier." }), {
      status: 500,
    });
  }
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
