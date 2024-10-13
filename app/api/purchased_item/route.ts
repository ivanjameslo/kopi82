// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Order model
export async function GET(request: NextRequest) {
  const purchased_item = await prisma.purchased_item.findMany();
  console.log(purchased_item);
  return NextResponse.json(purchased_item);
}

// POST function to create a new Purchase Order
export async function POST(request: NextRequest) {

  const res = await request.json();
  const { receipt_no, purchase_date } = res;

  if (!receipt_no) {
    return NextResponse.json(
      { error: "Please enter the Receipt Number." },
      { status: 400 }
    );
  }

  const existingReceiptNumber = await prisma.purchased_item.findFirst({
    where: {
      receipt_no: Number(receipt_no),
    },
  });

  if (existingReceiptNumber) {
    return NextResponse.json(
      { error: `A Purchase Order with the same Receipt Number already exists.` },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.purchased_item.create({
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