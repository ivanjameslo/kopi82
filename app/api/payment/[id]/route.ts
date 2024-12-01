import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

//GET function for fetching a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;


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


    return NextResponse.json(transformedDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!params || !params.id) {
      return NextResponse.json({ error: "Missing ID in URL" }, { status: 400 });
  }

  const id = params.id;
  const json = await request.json();

  const { payment_method, payment_status, discount_id, generated_code, reference_no } = json;

  try {
      // Validate required fields
      if (!payment_method || !payment_status || !reference_no) {
          return NextResponse.json(
              { error: "Missing required fields: payment_method, payment_status, or reference_no" },
              { status: 400 }
          );
      }

      // Update the payment record
      const updatedPayment = await prisma.payment.update({
          where: { payment_id: Number(id) },
          data: {
              payment_method,
              payment_status,
              discount_id,
              generated_code,
              reference_no,
          },
      });

      return NextResponse.json(updatedPayment, { status: 200 });
  } catch (error) {
      console.error("Error updating payment:", error);
      return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}

