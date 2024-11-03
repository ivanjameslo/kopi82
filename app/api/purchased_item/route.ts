// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Order model
export async function GET(request: NextRequest) {
  try{
    const purchased_item = await prisma.purchased_item.findMany({
      include: {
        supplier: true,
        purchased_detail: true,
        back_inventory: true,
      }
    });

    const data = purchased_item.map((purchased) => ({
      pi_id: purchased.pi_id,
      receipt_no: purchased.receipt_no,
      purchase_date: purchased.purchase_date,
      supplier: {
        supplier_id: purchased.supplier.supplier_id,
        supplier_name: purchased.supplier.supplier_name, // Include supplier name
        address: purchased.supplier.address, // If you want to include more details, you can add them here
        contact_no: purchased.supplier.contact_no,
      },
      // isUsed: purchased.purchased_detail.length > 0,
      isUsed: purchased.purchased_detail.some(detail => 
        Object.values(detail).some(value => value !== null)
      ),
    }));

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch purchased item." }), {
      status: 500,
  });
  }
}

// POST function to create a new Purchase Order
export async function POST(request: NextRequest) {

  const res = await request.json();
  const { receipt_no, purchase_date, supplier_id } = res;

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
        supplier_id: Number(supplier_id),
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Purchase Order", error);
    return NextResponse.json(error, {status: 500});
}
}