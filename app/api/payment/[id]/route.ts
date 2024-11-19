import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

//GET function for fetching a single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const payment = await prisma.payment.findMany({
    where: {
      payment_id: Number(id),
    }, include: {
      order: true,
      discount: true,
    }
      
  });
  return NextResponse.json(payment);
}

export async function PATCH(request: Request, {params}: { params: {id: string}}){
  const id = params.id;
  const json = await request.json();
  const {order_id, product_id,quantity} = json;

  try {
    if(!order_id || !product_id || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedOrder = await prisma.order_details.update({
      where: {
        orderDetails_id: Number(id),
      },
      data:{
        order_id: order_id,
        product_id: product_id,
        quantity: quantity

      },
      include: {
        product: true,
        order: true,
      },
    });
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
}
}