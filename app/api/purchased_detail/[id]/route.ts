// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type PurchasedDetail = {
    noExpiry: boolean;
    pi_id: string;
    item_name: string;
    quantity: string | number;
    unit: string;
    price: string | number;
    expiry_date: string | null;
    supplier_id: string | number;
  };

export async function GET (request: Request, { params } : { params  : { id: string}} ){
    const pi_id = params.id
    const purchased_detail = await prisma.purchased_detail.findMany({
        where: {
            pi_id: parseInt(pi_id, 10)
        }
    });
    return NextResponse.json(purchased_detail);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const pi_id = params.id;
        const formDataArray = await request.json();
        const created = await prisma.purchased_detail.createMany({
            data: formDataArray.map((formData: {
                noExpiry: any; pi_id: any; item_name: any; quantity: any; unit: any; price: any; expiry_date: any; supplier_id: any
}) => ({
                pi_id: parseInt(pi_id, 10),
                item_name: formData.item_name,
                quantity: Number(formData.quantity),
                unit: formData.unit,
                price: Number(formData.price),
                expiry_date: formData.noExpiry ? null : new Date(formData.expiry_date as string).toISOString(),  
                supplier_id: Number(formData.supplier_id),
            }))
        });
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error('Error creating purchase details:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
    }
}

export async function DELETE (request: Request, { params } : { params : { id: string}}){
    const pi_id = params.id;
    const deletedPurchasedDetail = await prisma.purchased_detail.deleteMany({
        where: {
            pi_id: parseInt(pi_id, 10)
        }
    })

    return NextResponse.json(deletedPurchasedDetail);
}