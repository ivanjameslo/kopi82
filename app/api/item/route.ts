import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parse } from "path";

// GET function to fetch all data from Purchase Details model
export async function GET(request: NextRequest) {
  const item = await prisma.item.findMany({
    include: {
        category: true,
        unit: true,
        location_shelf: true,
    }
  });
  console.log(item);
  return NextResponse.json(item);
}

// POST function to create a new Purchase Details
export async function POST(request: NextRequest) {
    try {
      const formDataArray = await request.json();

      // Validate input data to ensure all required fields are present and valid
    for (const formData of formDataArray) {
      const { item_name, unit_id, category_id, ls_id } = formData;

      // Validate: Check if all fields are present
      if (!item_name || !unit_id || !category_id || !ls_id) {
        return NextResponse.json(
          { error: "All fields (item_name, unit_id, category_id, ls_id) are required." },
          { status: 400 }
        );
      }

      // Validate: Check if the `item_name` is unique in the database
      const existingItem = await prisma.item.findFirst({
        where: { 
          item_name: {
            equals: item_name.toLowerCase(),  
          }
        },
      });

      if (existingItem) {
        return NextResponse.json(
          { error: `Item name "${item_name}" already exists.` },
          { status: 400 }
        );
      }
    }


      const created = await prisma.item.createMany({
        data: formDataArray.map((formData: { item_name: any; unit_id: any; category_id: any; ls_id: any; }) => ({
            item_name: formData.item_name,
            unit_id: Number(formData.unit_id),
            category_id: Number(formData.category_id),
            ls_id: Number(formData.ls_id),
            }))
      });
      return NextResponse.json({ success: true, createdCount: created.count }, { status: 201 });
    } catch (error) {
      console.log("Error creating Item", error);
      return NextResponse.json({ error: "Failed to create items" }, { status: 500 });
  }
  }