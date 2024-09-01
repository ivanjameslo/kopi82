// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from OrderDetails model
export async function GET(request: NextRequest) {
  const order_details = await prisma.order_details.findMany();
  console.log(order_details);
  return NextResponse.json(order_details);
}

// POST function to create a new order detail
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { order_id, product_id, quantity } = res;
    const created = await prisma.order_details.create({
      data: {
        order: {
          connect: { order_id: parseInt(order_id) }
        },
        product: {
          connect: { product_id: parseInt(product_id) }
        },
        quantity: Number(quantity),
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Order Details", error);
    return NextResponse.json(error, {status: 500});
}
}