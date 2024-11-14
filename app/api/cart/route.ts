// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to retrieve order details
export async function GET(request: NextRequest) {
  try {
    const cart = await prisma.cart.findMany({
      select: {
        order: {
          select: {
            order_id: true,
            customer_name: true,
            service_type: true,
          },
        },
        product: {
          select: {
            product_id: true,
            product_name: true,
            description: true,
            image_url: true,
            hotPrice: true,
            icedPrice: true,
            frappePrice: true,
            singlePrice: true,
          },
        },
        quantity: true,
      },
    });

    return new Response(JSON.stringify(cart), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch Order Details." }), {
      status: 500,
    });
  }
}

// POST function to create a new order detail
export async function POST(request: NextRequest) {
  try {
    const formDataArray = await request.json();

    if (!Array.isArray(formDataArray)) {
      return NextResponse.json(
        { error: "Invalid data format. Expected an array of cart." },
        { status: 400 }
      );
    }

    console.log("Received formDataArray:", formDataArray);

    for (const formData of formDataArray) {
      const { order_id, product_id, quantity } = formData;

      if (!order_id || !product_id || !quantity) {
        return NextResponse.json(
          { error: "Missing required fields." },
          { status: 400 }
        );
      }
    }

    const created = await prisma.cart.createMany({
      data: formDataArray.map((formData: { order_id: any; product_id: any; quantity: any; drink_type:any; price:any; }) => ({
        order_id: formData.order_id,
        product_id: formData.product_id,
        quantity: formData.quantity,
        drink_type: formData.drink_type,
        price: formData.price
      }))
    });

    return NextResponse.json({ success: true, createdCount: created.count }, { status: 201 });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
  }
}

