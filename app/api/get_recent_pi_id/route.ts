import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const recentPurchasedItem = await prisma.purchased_item.findFirst({
            orderBy: {
                pi_id: 'desc',
            },
        });

        if (!recentPurchasedItem) {
            return NextResponse.json({ error: 'No purchase orders found' }, { status: 404 });
        }

        return NextResponse.json(recentPurchasedItem, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}