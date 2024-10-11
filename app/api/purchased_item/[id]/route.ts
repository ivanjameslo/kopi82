// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET (request: Request, { params } : { params  : { id: string}} ){
    const id = params.id
    const purchase_order = await prisma.purchased_item.findMany({
        where: {
            pi_id: parseInt(id, 10)
        }, 
        include: {
            purchased_detail: true
        }

    });
    return NextResponse.json(purchase_order);
}

export async function PUT (request: Request, { params } : { params : {id: string}}) {
    const id = params.id;
    const json = await request.json();
    const updatedPurchaseOrder = await prisma.purchased_item.update({
        where: {
            pi_id: parseInt(id, 10)
        },
        data: json
    })

    return NextResponse.json(updatedPurchaseOrder);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const pi_id = parseInt(params.id, 10);
  
    try {
      // Delete all related records in the purchased_detail table first
      await prisma.purchased_detail.deleteMany({
        where: {
          pi_id,
        },
      });
  
      // Then delete the purchased_item
      const deletedItem = await prisma.purchased_item.delete({
        where: {
          pi_id,
        },
      });
  
      return NextResponse.json(deletedItem);
    } catch (error) {
      console.error('Error deleting purchase item:', error);
      return NextResponse.json({ error: 'Failed to delete purchase item' }, { status: 500 });
    }
  }
  