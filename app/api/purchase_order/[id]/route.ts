import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET (request: Request, { params } : { params  : { id: string}} ){
    const id = params.id
    const purchase_order = await prisma.purchase_order.findMany({
        where: {
            po_id: parseInt(id, 10)
        }, 
        include: {
            purchase_details: true
        }

    });
    return NextResponse.json(purchase_order);
}

export async function PUT (request: Request, { params } : { params : {id: string}}) {
    const id = params.id;
    const json = await request.json();
    const updatedPurchaseOrder = await prisma.purchase_order.update({
        where: {
            po_id: parseInt(id, 10)
        },
        data: json
    })

    return NextResponse.json(updatedPurchaseOrder);
}

export async function DELETE (request: Request, { params } : { params : { id: string}}){
    const id = params.id;
    const deletedPurchaseOrder = await prisma.purchase_order.delete({
        where: {
            po_id: parseInt(id, 10)
        }
    })

    return NextResponse.json(deletedPurchaseOrder);
}