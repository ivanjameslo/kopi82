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
    const formDataArray = await request.json();
    const created = await prisma.purchase_details.createMany({
        data: formDataArray.map((formData: { po_id: any; item_name: any; quantity: any; unit: any; price: any; }) => ({
            po_id: parseInt(formData.po_id),
            item_name: formData.item_name,
            quantity: Number(formData.quantity),
            unit: formData.unit,
            price: Number(formData.price),
        }))
    });
    return NextResponse.json(created, { status: 201 });
} catch (error) {
    console.error('Error creating purchase details:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
}
}