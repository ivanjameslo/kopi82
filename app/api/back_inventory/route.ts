import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Back Inventory model
export async function GET(request: NextRequest) {
  const back_inventory = await prisma.back_inventory.findMany();
  console.log(back_inventory);
  return NextResponse.json(back_inventory);
}

// POST function to create a new Back Inventory
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { name, item_stocks, category, location_shelf, stock_in_date, expiry_date, stock_damaged, po_id } = res;
    const created = await prisma.back_inventory.create({
      data: {
        name,
        item_stocks: Number(item_stocks),
        category,
        location_shelf,
        stock_in_date,
        expiry_date,
        stock_damaged: Number(stock_damaged),
        purchase_order: {
          connect: { po_id: parseInt(po_id) }
        },
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Back Inventory", error);
    return NextResponse.json(error, {status: 500});
}
}