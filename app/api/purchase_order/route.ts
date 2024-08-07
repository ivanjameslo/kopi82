import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Order model
export async function GET(request: NextRequest) {
  const purchase_order = await prisma.purchase_order.findMany();
  console.log(purchase_order);
  return NextResponse.json(purchase_order);
}

// POST function to create a new Purchase Order
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { receipt_no, purchase_date } = res;
    const created = await prisma.purchase_order.create({
      data: {
        receipt_no: Number(receipt_no),
        purchase_date,
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Purchase Order", error);
    return NextResponse.json(error, {status: 500});
}
}