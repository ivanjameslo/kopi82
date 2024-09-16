// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET (request: Request, { params } : { params  : { id: string}} ){
    const id = params.id
    const front_inventory = await prisma.front_inventory.findUnique({
        where: {
            fd_id: parseInt(id, 10)
        },
        include: {
          back_inventory: true
        }
    });
    return NextResponse.json(front_inventory);
}

export async function PUT (request: Request, { params } : { params : {id: string}}) {
    const id = params.id;
    const json = await request.json();
    const updatedFrontInventory = await prisma.front_inventory.update({
        where: {
            fd_id: parseInt(id, 10)
        },
        data: {
            in_stock: parseInt(json.in_stock),
            stock_used: parseInt(json.stock_used),
            stock_damaged: parseInt(json.stock_damaged),
            product: {
                connect: { product_id: parseInt(json.product_id) }
            }
        }
    })

    return NextResponse.json(updatedFrontInventory);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const data = await request.json();
  
      console.log('Received data for PATCH:', data); // Log received data
  
      // Validate data (e.g., required fields) before processing
      if (!data.stock_used && !data.stock_damaged && !data.stock_out_date && !data.in_stock && !data.stock_in_date) {
        return new Response('Invalid data', { status: 400 });
      }
  
      // Your database update logic goes here
      const updatedItem = await prisma.front_inventory.update({
        where: { fd_id: parseInt(id) },
        data: {
          ...data,
        },
      });
  
      return new Response(JSON.stringify(updatedItem), { status: 200 });
    } catch (error) {
      console.error('Error during PATCH:', error); // Log error
      return new Response('Failed to update item', { status: 500 });
    }
  }

export async function DELETE (request: Request, { params } : { params : { id: string}}){
    const id = params.id;
    const deletedFrontInventory = await prisma.front_inventory.delete({
        where: {
            fd_id: parseInt(id, 10)
        }
    })

    return NextResponse.json(deletedFrontInventory);
}