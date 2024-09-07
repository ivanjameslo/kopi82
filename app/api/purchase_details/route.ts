// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
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
        data: formDataArray.map((formData: { po_id: any; item_id: any; quantity: any; unit_id: any; price: any; expiry_date: any; }) => ({
            po_id: parseInt(formData.po_id),
            item_id: parseInt(formData.item_id),
            quantity: Number(formData.quantity),
            unit_id: parseInt(formData.unit_id),
            price: Number(formData.price),
            expiry_date: formData.expiry_date,
        }))
    });
    return NextResponse.json(created, { status: 201 });
} catch (error) {
    console.error('Error creating purchase details:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
}
}