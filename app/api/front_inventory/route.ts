import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET function to fetch all data from Front Inventory model
export async function GET(request: NextRequest) {
  try {
    const front_inventory = await prisma.front_inventory.findMany({
      include: {
        back_inventory: {
          include: {
            item: true,
            unit: true,
          }
        }
      }
    });
    return NextResponse.json(front_inventory);
  } catch (error) {
    console.error("Error fetching Front Inventory:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// POST function to create a new Front Inventory
export async function POST(request: NextRequest) {
  try {
    const formDataArray = await request.json();

    // Log the incoming request data for debugging
    console.log("Received data for POST:", formDataArray);

    // Fetch related BackInventory including item and unit relations
    const back_inventory = await prisma.back_inventory.findMany({
      include: {
        item: true,
        unit: true,
      },
    });

    // Create a map for quick lookup of BackInventory by bd_id
    const backInventoryMap = new Map(back_inventory.map(bi => [bi.bd_id, bi]));

    // Create FrontInventory entries
    const frontInventoryData = formDataArray.map((formData: {
      bd_id: string;
      in_stock: string;
      stock_used: string;
      stock_damaged: string;
      stock_in_date: string;
      stock_out_date: string;
      product_id: string | null;
    }) => {
      const backInv = backInventoryMap.get(parseInt(formData.bd_id));

      if (!backInv) {
        throw new Error(`Back Inventory with ID ${formData.bd_id} not found`);
      }

      return {
        bd_id: parseInt(formData.bd_id),
        in_stock: Number(formData.in_stock),
        stock_used: Number(formData.stock_used),
        stock_damaged: Number(formData.stock_damaged),
        stock_in_date: formData.stock_in_date === "N/A" ? null : new Date(formData.stock_in_date),
        stock_out_date: formData.stock_out_date === "N/A" ? null : new Date(formData.stock_out_date),
        product_id: formData.product_id ? parseInt(formData.product_id) : null,
      };
    });

    // Insert data into FrontInventory
    const created = await prisma.front_inventory.createMany({
      data: frontInventoryData,
      skipDuplicates: true, // Avoid duplicates
    });

    // Log the inserted data for debugging
    console.log("Inserted data:", created);

    // Refetch the inserted records if needed
    const newFrontInventory = await prisma.front_inventory.findMany({
      where: {
        bd_id: {
          in: formDataArray.map((formData: { bd_id: string }) => parseInt(formData.bd_id)),
        },
      },
    });

    return NextResponse.json(newFrontInventory, { status: 201 });
  } catch (error) {
    console.error("Error creating Front Inventory:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}
