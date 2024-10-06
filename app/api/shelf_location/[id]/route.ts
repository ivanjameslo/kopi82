import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET method to fetch a location shelf by ID or check if a ls_name exists
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
  
    if (id) {
      const sl = await prisma.shelf_location.findUnique({
        where: {
          sl_id: parseInt(id, 10),
        },
      });
      return NextResponse.json(sl);
    }
  
    const { searchParams } = new URL(request.url);
    const sl_name = searchParams.get('sl_name');
  
    if (sl_name) {
      const existingSL = await prisma.shelf_location.findFirst({
        where: {
          sl_name: sl_name,
        },
      });
      return NextResponse.json({ exists: !!existingSL });
    }
  
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

// PUT method to update an existing location shelf
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const json = await request.json();

    const updatedSL = await prisma.shelf_location.update({
        where: {
            sl_id: parseInt(id, 10)
        },
        data: json
    });

    return NextResponse.json(updatedSL);
}

// DELETE method to delete a location shelf by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const deletedSL = await prisma.shelf_location.delete({
        where: {
            sl_id: parseInt(id, 10)
        }
    });

    return NextResponse.json(deletedSL);
}