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

export async function DELETE (request: Request, { params } : { params : { id: string}}){
    const id = params.id;
    const deletedPurchaseOrder = await prisma.purchased_item.delete({
        where: {
            pi_id: parseInt(id, 10)
        }
    })

    return NextResponse.json(deletedPurchaseOrder);
}