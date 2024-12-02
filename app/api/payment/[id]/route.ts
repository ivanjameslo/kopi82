import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

//GET function for fetching a single payment
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const generatedCode = params.id;
  try {
    const payment = await prisma.payment.findFirst({
      where: {
        generated_code: generatedCode,
      },
      include: {
        order: {
          include: {
            order_details: true,
          }
        },
        discount: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const json = await request.json();

  try {
    const updatedPayment = await prisma.payment.update({
      where: {
        payment_id: Number(id),
      },
      data: json,
    });
    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
