'use server'

import prisma from "@/lib/db";
import { discount, order, order_details, payment, product } from "@prisma/client";

type PaymentWithRelations = payment & {
    order: (order & {
        order_details: (order_details & {
            product: Pick<product, 'product_id' | 'product_name'>
        })[]
    }) | null
    discount: discount | null
}

export type ReceiptData = {
    payment: PaymentWithRelations
}

export async function fetchReceipt(paymentId: number): Promise<ReceiptData | null> {
    const payment = await prisma.payment.findUnique({
        where: {
            payment_id: paymentId
        },
        include: {
            order: {
                include: {
                    order_details: {
                        include: {
                            product: {
                                select: {
                                    product_id: true,
                                    product_name: true,
                                }
                            }
                        }
                    }
                }
            },
            discount: true
        }
    });

    if (!payment) {
        return null;
    }

    return { payment } as ReceiptData;
}