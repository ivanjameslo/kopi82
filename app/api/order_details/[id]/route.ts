import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

//GET function for fetching a single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const orderdetails = await prisma.order_details.findMany({
    where: {
      orderDetails_id: Number(id),
    }, include: {
      product: true,
      order: true,
    }
      
  });
  return NextResponse.json(orderdetails);
}

// export async function POST(request: Request, {params}: {params: {id: string}}) {
//   try {
//     const od_id = params.id;
//     const formOrderdetailsArray = await request.json();
//     const created = await prisma.order_details.createMany({
//       data: formOrderdetailsArray.map((formOrderdetails: {
//         order_id: any; product_id: any; quantity: any
//       }) => ({
//         order_id: Number(formOrderdetails.order_id),
//         product_id: Number(formOrderdetails.product_id),
//         quantity: Number(formOrderdetails.quantity)
//       }))
//     })
//     return NextResponse.json(created, { status: 201 });
//   } catch (error) {
//     console.error('Error creating order details:', error);
//     return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
// }
// }


export async function PUT(request: Request, {params}: { params: {id: string}}){
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