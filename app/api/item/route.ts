import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parse } from "path";

export async function GET(request: NextRequest) {
  const item = await prisma.item.findMany({
    include: {
        category: true,
        unit: true,
    }
  });
  console.log(item);
  return NextResponse.json(item);
}

export async function POST(request: NextRequest) {
    try {
      const formDataArray = await request.json();

      // Validate input data to ensure all required fields are present and valid
    for (const formData of formDataArray) {
      const { item_name, description, unit_id, category_id } = formData;

      // Validate: Check if all fields are present
      if (!item_name || !unit_id || !category_id || !description) {
        return NextResponse.json(
          { error: "All fields (item_name, unit_id, category_id, ls_id) are required." },
          { status: 400 }
        );
      }

      // Validate: Check if the `item_name` is unique in the database
      const existingItem = await prisma.item.findFirst({
        where: { 
          item_name: {
            equals: item_name,
            mode: 'insensitive', // Perform a case-insensitive comparison
          },
          description: {
            equals: description,
            mode: 'insensitive', // Perform a case-insensitive comparison
          },
          unit_id: Number(unit_id),
          category_id: Number(category_id),
        },
      });

      if (existingItem) {
        return NextResponse.json(
          { error: `An item with the same details already exists.` },
          { status: 400 }
        );
      }
    }

      const created = await prisma.item.createMany({
        data: formDataArray.map((formData: { item_name: any; description: any; unit_id: any; category_id: any; ls_id: any; }) => ({
            item_name: formData.item_name,
            description: formData.description,
            unit_id: Number(formData.unit_id),
            category_id: Number(formData.category_id),
            }))
      });
      return NextResponse.json({ success: true, createdCount: created.count }, { status: 201 });
    } catch (error) {
      console.log("Error creating Item", error);
      return NextResponse.json({ error: "Failed to create items" }, { status: 500 });
  }
  }