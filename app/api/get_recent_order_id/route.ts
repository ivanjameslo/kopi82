import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const recentOrder = await prisma.order.findFirst({
            orderBy: {
                order_id: 'desc',
            },
        });

        if (!recentOrder) {
            return NextResponse.json({ error: 'No purchase orders found' }, { status: 404 });
        }

        return NextResponse.json(recentOrder, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}