import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET (request: Request, { params } : { params  : { id: string}} ){
    const po_id = params.id
    const purchase_details = await prisma.purchase_details.findMany({
        where: {
            po_id: parseInt(po_id, 10)
        }
    });
    return NextResponse.json(purchase_details);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const po_id = params.id;
        const formDataArray = await request.json();
        const created = await prisma.purchase_details.createMany({
            data: formDataArray.map((formData: { po_id: any; item_name: any; quantity: any; unit: any; price: any; }) => ({
                po_id: parseInt(po_id, 10),
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
    const po_id = params.id;
    const deletedPurchaseDetails = await prisma.purchase_details.deleteMany({
        where: {
            po_id: parseInt(po_id, 10)
        }
    })

    return NextResponse.json(deletedPurchaseDetails);
}