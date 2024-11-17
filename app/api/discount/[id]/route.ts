import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET method to fetch a unit by ID or check if a unit_name exists
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id
    const discount = await prisma.discount.findUnique({
        where: {
            discount_id: Number(id)
        },
    });
    return NextResponse.json(discount);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const json = await request.json();
    const { discount_name, discount_rate, status } = json;

    try {
        if (!discount_name || !discount_rate || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updatedDiscount = await prisma.discount.update({
            where: {
                discount_id: Number(id),
            },
            data: {
                discount_name,
                discount_rate,
                status,
            },
        });

        return NextResponse.json(updatedDiscount);
    } catch (error) {
        console.error('Error updating item:', error);
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
}


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const discountId = Number(params.id);
  
    try {
      const updatedFields = await request.json();  // This will contain only the fields to update
  
      const updatedDiscount= await prisma.discount.update({
        where: { discount_id: discountId },
        data: updatedFields,  // Update only the provided fields
      });
  
      return NextResponse.json(updatedDiscount);
    } catch (error) {
      console.log("Error updating item", error);
      return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
  }

// DELETE method to delete a unit by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const deletedDiscount = await prisma.discount.delete({
        where: {
            discount_id: parseInt(id, 10)
        }
    });

    return NextResponse.json(deletedDiscount);
}