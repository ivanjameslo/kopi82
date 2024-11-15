// import { prisma } from "@/utils/prisma"
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Order model
export async function GET(request: NextRequest) {
  const orders = await prisma.order.findMany()
  return NextResponse.json(orders)
}

// POST function to create a new order
export async function POST(request: NextRequest){
    try{
        const res = await request.json();
        const { customer_name, service_type, date } = res;
        console.log("Data to Insert:", { customer_name, service_type, date });
        const created = await prisma.order.create({
            data: {
                customer_name,
                service_type,
                date: new Date(date),
            }
        });
        return NextResponse.json(created, {status: 201})
    } catch (error) {
        console.log("Error creating Order", error);
        return NextResponse.json(error, {status: 500});
    }
}