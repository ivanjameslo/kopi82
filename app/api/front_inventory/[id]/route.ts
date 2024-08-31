// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET (request: Request, { params } : { params  : { id: string}} ){
    const id = params.id
    const front_inventory = await prisma.front_inventory.findUnique({
        where: {
            fd_id: parseInt(id, 10)
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
            unit: json.unit,
            stock_used: parseInt(json.stock_used),
            stock_damaged: parseInt(json.stock_damaged),
            product: {
                connect: { product_id: parseInt(json.product_id) }
            }
        }
    })

    return NextResponse.json(updatedFrontInventory);
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