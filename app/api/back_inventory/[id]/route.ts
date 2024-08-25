import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET (request: Request, { params } : { params  : { id: string}} ){
    const id = params.id
    const back_inventory = await prisma.back_inventory.findUnique({
        where: {
            bd_id: parseInt(id, 10)
        }
    });
    return NextResponse.json(back_inventory);
}

export async function PUT (request: Request, { params } : { params : {id: string}}) {
    const id = params.id;
    const json = await request.json();
    const updatedBackInventory = await prisma.back_inventory.update({
        where: {
            bd_id: parseInt(id, 10)
        },
        data: json
    })

    return NextResponse.json(updatedBackInventory);
}

export async function DELETE (request: Request, { params } : { params : { id: string}}){
    const id = params.id;
    const deletedBackInventory = await prisma.back_inventory.delete({
        where: {
            bd_id: parseInt(id, 10)
        }
    })

    return NextResponse.json(deletedBackInventory);
}