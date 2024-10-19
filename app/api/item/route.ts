import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parse } from "path";

// export async function GET(request: NextRequest) {
//   const item = await prisma.item.findMany({
//     include: {
//         category: true,
//         unit: true,
//     }
//   });
//   console.log(item);
//   return NextResponse.json(item);
// }
export async function GET(req: Request) {
  try {
      // Fetch all items and check if they are part of purchased_detail or back_inventory
      const items = await prisma.item.findMany({
          select: {
              item_id: true,
              item_name: true,
              description: true,
              unit: {
                  select: {
                      unit_id: true,
                      unit_name: true,
                  },
              },
              category: {
                  select: {
                      category_id: true,
                      category_name: true,
                  },
              },
              purchased_detail: true, // Check if related to purchased_detail
          },
      });

      // Modify the data to include isUsed field
      const data = items.map((item) => ({
          item_id: item.item_id,
          item_name: item.item_name,
          description: item.description,
          unit: item.unit,
          category: item.category,
          isUsed: item.purchased_detail.length > 0, // If the item is part of purchased_detail or back_inventory
      }));

      return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
      });
  } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch items." }), {
          status: 500,
      });
  }
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