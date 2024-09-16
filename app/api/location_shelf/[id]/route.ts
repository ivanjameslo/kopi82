import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET method to fetch a location shelf by ID or check if a ls_name exists
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
  
    if (id) {
      const ls = await prisma.location_shelf.findUnique({
        where: {
          ls_id: parseInt(id, 10),
        },
      });
      return NextResponse.json(ls);
    }
  
    const { searchParams } = new URL(request.url);
    const ls_name = searchParams.get('ls_name');
  
    if (ls_name) {
      const existingLS = await prisma.location_shelf.findFirst({
        where: {
          ls_name: ls_name,
        },
      });
      return NextResponse.json({ exists: !!existingLS });
    }
  
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

// PUT method to update an existing location shelf
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const json = await request.json();

    const updatedLS = await prisma.location_shelf.update({
        where: {
            ls_id: parseInt(id, 10)
        },
        data: json
    });

    return NextResponse.json(updatedLS);
}

// DELETE method to delete a location shelf by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const deletedLS = await prisma.location_shelf.delete({
        where: {
            ls_id: parseInt(id, 10)
        }
    });

    return NextResponse.json(deletedLS);
}