import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET function to fetch cart details
export async function GET(request: NextApiRequest, res: NextApiResponse) {
    const cart = await prisma.cart.findMany();
    return NextResponse.json(cart);
}

// POST function to create a new cart detail
export async function POST(request: NextRequest) {
    try {
        const res = await request.json();
        const { productId, productName, price, quantity } = res;

        const created = await prisma.cart.create({
            data: {
                productId: Number(productId),
                productName: String(productName),
                price: String(price),
                quantity: Number(quantity),
            }
        });

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.log("Error creating Cart", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}