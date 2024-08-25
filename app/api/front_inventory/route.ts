import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Front Inventory model
export async function GET(request: NextRequest) {
  const front_inventory = await prisma.front_inventory.findMany();
  console.log(front_inventory);
  return NextResponse.json(front_inventory);
}

// POST function to create a new Front Inventory
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { bd_id, in_stock, unit, stock_used, stock_damaged, product_id } = res;
    const created = await prisma.front_inventory.create({
      data: {
        back_inventory: {
          connect: { bd_id: parseInt(bd_id) }
        },
        in_stock: Number(in_stock),
        unit,
        stock_used: Number(stock_used),
        stock_damaged: Number(stock_damaged),
        product: {
          connect: { product_id: parseInt(product_id) }
        },
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Front Inventory", error);
    return NextResponse.json(error, {status: 500});
}
}