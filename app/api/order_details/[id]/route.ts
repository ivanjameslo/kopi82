import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

//GET function for fetching a single product
// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   const id = params.id
//   const orderdetails = await prisma.order_details.findMany({
//     where: {
//       orderDetails_id: Number(id),
//     }, include: {
//       product: true,
//       order: {
//         select: {
//           customer_name: true,
//           service_type: true,
//         }
//       },
//     }
      
//   });
//   return NextResponse.json(orderdetails);
// }

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

<<<<<<< HEAD

=======
>>>>>>> 6c2cd4f6c4b8d97180acf025cfb0e637ee0f3a1f
  try {
    const orderDetails = await prisma.order_details.findMany({
      where: {
        order_id: Number(id),
      },
      include: {
        product: {
          select: {
            product_id: true,
            product_name: true,
            image_url: true,
            hotPrice: true,
            icedPrice: true,
            singlePrice: true,
            frappePrice: true,
          },
        },
        order: {
          select: {
            customer_name: true,
            service_type: true,
          },
        },
      },
    });

<<<<<<< HEAD

=======
>>>>>>> 6c2cd4f6c4b8d97180acf025cfb0e637ee0f3a1f
    // Transform the response for easier frontend consumption
    const transformedDetails = orderDetails.map((detail) => ({
      product_id: detail.product.product_id,
      product_name: detail.product.product_name,
      image_url: detail.product.image_url,
      hotPrice: detail.product.hotPrice,
      icedPrice: detail.product.icedPrice,
      singlePrice: detail.product.singlePrice,
      frappePrice: detail.product.frappePrice,
      quantity: detail.quantity,
      price: detail.price,
      customer_name: detail.order?.customer_name || "Unknown",
      service_type: detail.order?.service_type || "Unknown",
    }));

<<<<<<< HEAD

=======
>>>>>>> 6c2cd4f6c4b8d97180acf025cfb0e637ee0f3a1f
    return NextResponse.json(transformedDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
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