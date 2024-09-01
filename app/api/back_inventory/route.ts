// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
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
    const formDataArray = await request.json();
    const created = await prisma.back_inventory.createMany({
      data: formDataArray.map((formData: { item_name: any; item_stocks: any; unit: any; category: any; location_shelf: any; stock_in_date: string | number | Date; expiry_date: string | number | Date; stock_damaged: any; po_id: string; }) => ({
        item_name: formData.item_name,
        item_stocks: Number(formData.item_stocks),
        unit: formData.unit,
        category: formData.category,
        location_shelf: formData.location_shelf,
        stock_in_date: new Date(formData.stock_in_date),
        expiry_date: new Date(formData.expiry_date),
        stock_damaged: Number(formData.stock_damaged),
        po_id: parseInt(formData.po_id) // Use po_id instead of purchase_order
      }))
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Back Inventory", error);
    return NextResponse.json(error, { status: 500 });
  }
}