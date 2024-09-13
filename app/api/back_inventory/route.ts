// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Back Inventory model
export async function GET(request: NextRequest) {
  const back_inventory = await prisma.back_inventory.findMany({
    include: {
      item: true,
      unit: true,
      category: true,
      location_shelf: true,
      purchase_order: {
        include: {
          purchase_details: true
        }
      },
    }
  });
  
  // Process the data to include the expiry date from purchase details
  const processedData = back_inventory.map((inventory) => {
    const purchaseDetails = inventory.purchase_order?.purchase_details || [];
    const expiryDate = purchaseDetails.length > 0 ? purchaseDetails[0].expiry_date : null;

    return {
      ...inventory,
      expiry_date: expiryDate,
    };
  });

  console.log(processedData);
  return NextResponse.json(processedData);
}

// POST function to create a new Back Inventory
export async function POST(request: NextRequest) {
  try {
    const formDataArray = await request.json();

    //Fetch related data from Item
    const items = await prisma.item.findMany({
      include: {
        unit: true,
        category: true,
        location_shelf: true,
      }
    });

    //Crate a map for quick lookup
    const itemMap = new Map(items.map(item => [item.item_id, item]));
    

    const created = await prisma.back_inventory.createMany({
      data: formDataArray.map((formData: {item_id: number, stock_in_date: string | number | Date; expiry_date: string | number | Date; stock_damaged: number; stock_out_date: string | number | Date; po_id: string; pd_id: string}) => {
        const item = itemMap.get(formData.item_id);
        if (!item) {
          throw new Error(`Item with ID ${formData.item_id} not found`);
        }

        return {
          item_id: item.item_id,
          item_stocks: 0,
          unit_id: item.unit_id,
          category_id: item.category_id,
          ls_id: item.ls_id,
          stock_in_date: formData.stock_in_date === "N/A" ? null : new Date(formData.stock_in_date),
          stock_damaged: Number(formData.stock_damaged),
          stock_out_date: formData.stock_out_date === "N/A" ? null : new Date(formData.stock_out_date),
          po_id: parseInt(formData.po_id),
          pd_id: parseInt(formData.pd_id),
          expiry_date: formData.expiry_date === "N/A" ? null : new Date(formData.expiry_date),
        };
      }),
      skipDuplicates: true,
    });

    // Fetch the newly created records from the database
    const newBackInventory = await prisma.back_inventory.findMany({
      where: {
        item_id: {
          in: formDataArray.map((item: { item_id: any; }) => item.item_id),
        },
      },
    });

    return NextResponse.json(newBackInventory, { status: 201 });

  } catch (error) {
    console.log("Error creating Back Inventory", error);
    return NextResponse.json(error, { status: 500 });
  }
}