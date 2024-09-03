import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET (request: Request, { params } : { params  : { id: string}} ){
    const id = params.id
    const location_shelf = await prisma.location_shelf.findUnique({
        where: {
            ls_id: parseInt(id, 10)
        }, 
    });
    return NextResponse.json(location_shelf);
}

export async function PUT (request: Request, { params } : { params : {id: string}}) {
    const id = params.id;
    const json = await request.json();
    const updatedLocationShelf = await prisma.location_shelf.update({
        where: {
            ls_id: parseInt(id, 10)
        },
        data: json
    })

    return NextResponse.json(updatedLocationShelf);
}

export async function DELETE (request: Request, { params } : { params : { id: string}}){
    const id = params.id;
    const deletedLocationShelf = await prisma.location_shelf.delete({
        where: {
            ls_id: parseInt(id, 10)
        }
    })

    return NextResponse.json(deletedLocationShelf);
}