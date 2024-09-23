// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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
            data: formDataArray.map((formData: { pi_id: any; item_name: any; quantity: any; unit: any; price: any; }) => ({
                pi_id: parseInt(pi_id, 10),
                item_name: formData.item_name,
                quantity: Number(formData.quantity),
                unit: formData.unit,
                price: Number(formData.price),
            }))
        });
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error('Error creating purchase details:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
    }
}

// export async function POST(request: Request, { params }: { params: { id: string } }) {
//     try {
//         const po_id = params.id;
//         if (isNaN(parseInt(po_id, 10))) {
//             return NextResponse.json({ error: 'Invalid PO ID' }, { status: 400 });
//         }
//         const json = await request.json();

//         // Validate and parse each purchase detail
//         const purchaseDetailsData = json.map((detail: any) => {
//             const { item_name, quantity, unit, price } = detail;

//             if (!item_name || isNaN(quantity) || !unit || isNaN(price)) {
//                 throw new Error('Invalid data format');
//             }

//             return {
//                 ...detail,
//                 po_id: po_id,
//                 quantity: parseInt(quantity),
//                 unit,
//                 price: parseFloat(price),
//             };
//         });

//         const createdPurchaseDetails = await prisma.purchase_details.createMany({
//             data: purchaseDetailsData
//         });

//         return NextResponse.json(createdPurchaseDetails);
//     } catch (error) {
//         console.error('Error creating purchase details:', error);
//         return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
//     }
// }

export async function DELETE (request: Request, { params } : { params : { id: string}}){
    const pi_id = params.id;
    const deletedPurchasedDetail = await prisma.purchased_detail.deleteMany({
        where: {
            pi_id: parseInt(pi_id, 10)
        }
    })

    return NextResponse.json(deletedPurchasedDetail);
}