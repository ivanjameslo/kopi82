import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id
    const employee = await prisma.employee.findUnique({
        where: {
            id: id
        }
    });
    return NextResponse.json(employee);
}

export async function PUT(request: Request, { params }: { params: { id: string }}) {
    const id = params.id
    const json = await request.json()
    const updatedEmployee = await prisma.employee.update({
        where: {
            id: id
        },
        data: json
    })
    return NextResponse.json(updatedEmployee);
}