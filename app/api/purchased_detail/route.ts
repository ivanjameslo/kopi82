import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Details model
export async function GET(request: NextRequest) {
  const purchased_detail = await prisma.purchased_detail.findMany({
    include: {
      item: true,
      unit: true,
    },
  });
  console.log(purchased_detail);
  return NextResponse.json(purchased_detail);
}

// POST function to create a new Purchase Details
export async function POST(request: NextRequest) {
  try {
    const formDataArray = await request.json();
    console.log("Received formDataArray:", formDataArray);

    for (const formData of formDataArray) {
      const { item_id, quantity, unit_id, price, supplier_id } = formData;

      if (!item_id || !quantity || !unit_id || !price || !supplier_id) {
        return NextResponse.json(
          { error: "All fields (item, quantity, unit, price, supplier) are required." },
          { status: 400 }
        );
      }

      const isNumeric = /^\d+$/.test(quantity) && /^\d+$/.test(price);
      if (!isNumeric) {
        return NextResponse.json(
          { error: "Quantity and Price must be a Number." },
          { status: 400 }
        );
      }
    }

    const created = await prisma.purchased_detail.createMany({
      data: formDataArray.map((formData: { pi_id: any; item_id: any; quantity: any; unit_id: any; price: any; expiry_date: any; supplier_id: any }) => ({
        pi_id: parseInt(formData.pi_id),
        item_id: parseInt(formData.item_id),
        quantity: Number(formData.quantity),
        unit_id: parseInt(formData.unit_id),
        price: Number(formData.price),
        expiry_date: formData.expiry_date,
        supplier_id: parseInt(formData.supplier_id),
      })),
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase details:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
  }
}