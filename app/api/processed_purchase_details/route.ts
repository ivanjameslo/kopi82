// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Order model
export async function GET(request: NextRequest) {
  const processed_purchase_order = await prisma.processedPurchaseDetails.findMany();
  console.log(processed_purchase_order);
  return NextResponse.json(processed_purchase_order);
}

// POST function to create a new Purchase Order
export async function POST(request: NextRequest) {
  try {
    const { pd_id } = await request.json();

    const processedPurchase = await prisma.processedPurchaseDetails.create({
      data: {
        pd_id: pd_id,
      },
    });

    return new Response(JSON.stringify({ message: 'Purchase detail processed successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}