import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET (request: Request, { params } : { params  : { id: string}} ){
    const id = params.id
    const category = await prisma.category.findUnique({
        where: {
            category_id: parseInt(id, 10)
        }, 
    });
    return NextResponse.json(category);
}

export async function PUT (request: Request, { params } : { params : {id: string}}) {
    const id = params.id;
    const json = await request.json();
    const updatedCategory = await prisma.category.update({
        where: {
            category_id: parseInt(id, 10)
        },
        data: json
    })

    return NextResponse.json(updatedCategory);
}

export async function DELETE (request: Request, { params } : { params : { id: string}}){
    const id = params.id;
    const deletedCategory = await prisma.category.delete({
        where: {
            category_id: parseInt(id, 10)
        }
    })

    return NextResponse.json(deletedCategory);
}