import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Details model
export async function GET(request: NextRequest) {
  const unit = await prisma.unit.findMany();
  console.log(unit);
  return NextResponse.json(unit);
}

// POST function to create a new Category
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { unit_name } = res;

    // Fetch all categories and filter manually in JavaScript (case-insensitive comparison)
    const existingUnit = await prisma.unit.findFirst({
      where: {
        unit_name: {
          equals: unit_name.toLowerCase(), // Normalize the input
        },
      },
    });

    // Check if a category with the same normalized name exists
    if (existingUnit && existingUnit.unit_name.toLowerCase() === unit_name.toLowerCase()) {
      return NextResponse.json({ error: "Unit already exists" }, { status: 400 });
    }

    // If no existing category, create a new one
    const created = await prisma.unit.create({
      data: {
        unit_name,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Unit", error);
    return NextResponse.json({ error: "Failed to create Unit" }, { status: 500 });
  }
}