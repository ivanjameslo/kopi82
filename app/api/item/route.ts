import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parse } from "path";

// GET function to fetch all data from Purchase Details model
export async function GET(request: NextRequest) {
  const item = await prisma.item.findMany({
    include: {
        category: true,
        unit: true,
        location_shelf: true,
    }
  });
  console.log(item);
  return NextResponse.json(item);
}

// POST function to create a new Purchase Details
export async function POST(request: NextRequest) {
    try {
      const formDataArray = await request.json();
      const created = await prisma.item.createMany({
        data: formDataArray.map((formData: { item_name: any; unit_id: any; category_id: any; ls_id: any; }) => ({
            item_name: formData.item_name,
            unit_id: parseInt(formData.unit_id),
            category_id: parseInt(formData.category_id),
            ls_id: parseInt(formData.ls_id),
            }))
      });
      return NextResponse.json(created, { status: 201 });
    } catch (error) {
      console.log("Error creating Item", error);
      return NextResponse.json(error, {status: 500});
  }
  }