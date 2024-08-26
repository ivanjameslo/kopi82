import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const recentPurchaseOrder = await prisma.purchase_order.findFirst({
            orderBy: {
                po_id: 'desc',
            },
        });

        if (!recentPurchaseOrder) {
            return NextResponse.json({ error: 'No purchase orders found' }, { status: 404 });
        }

        return NextResponse.json(recentPurchaseOrder, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}