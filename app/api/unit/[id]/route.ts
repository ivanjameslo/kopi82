import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET (request: Request, { params } : { params  : { id: string}} ){
    const id = params.id
    const unit = await prisma.unit.findUnique({
        where: {
            unit_id: parseInt(id, 10)
        }, 
    });
    return NextResponse.json(unit);
}

export async function PUT (request: Request, { params } : { params : {id: string}}) {
    const id = params.id;
    const json = await request.json();
    const updatedUnit = await prisma.unit.update({
        where: {
            unit_id: parseInt(id, 10)
        },
        data: json
    })

    return NextResponse.json(updatedUnit);
}

export async function DELETE (request: Request, { params } : { params : { id: string}}){
    const id = params.id;
    const deletedUnit = await prisma.unit.delete({
        where: {
            unit_id: parseInt(id, 10)
        }
    })

    return NextResponse.json(deletedUnit);
}