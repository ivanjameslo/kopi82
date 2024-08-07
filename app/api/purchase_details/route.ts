import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Details model
export async function GET(request: NextRequest) {
  const purchase_details = await prisma.purchase_details.findMany();
  console.log(purchase_details);
  return NextResponse.json(purchase_details);
}

// POST function to create a new Purchase Details
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { po_id, item_name, quantity, price } = res;
    const created = await prisma.purchase_details.create({
      data: {
        purchase_order: {
            connect: { po_id: Number(po_id) }
        },
        item_name,
        quantity: Number(quantity),
        price: Number(price),
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Purchase Order", error);
    return NextResponse.json(error, {status: 500});
}
}