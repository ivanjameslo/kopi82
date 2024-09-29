import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const productId = parseInt(params.id, 10);

        if (isNaN(productId)) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: {
                product_id: productId,
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}