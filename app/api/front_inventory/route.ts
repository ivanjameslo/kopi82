// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
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
    const formDataArray = await request.json();
    const created = await prisma.front_inventory.createMany({
      data: formDataArray.map((formData: { bd_id: any; in_stock: any; unit: any; stock_used: any; stock_damaged: any; product_id: any; }) => ({
        bd_id: parseInt(formData.bd_id),
        in_stock: Number(formData.in_stock),
        unit: formData.unit,
        stock_used: Number(formData.stock_used),
        stock_damaged: Number(formData.stock_damaged),
        product_id: parseInt(formData.product_id)
      }))
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Front Inventory", error);
    return NextResponse.json(error, {status: 500});
}
}