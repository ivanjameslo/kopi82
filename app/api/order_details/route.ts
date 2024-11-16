import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { date } from "zod";

// GET function to retrieve order details
export async function GET(request: NextRequest) {
  try {
    const orderDetails = await prisma.order_details.findMany({
      select: {
        order: {
          select: {
            order_id: true,
            customer_name: true,
            service_type: true,
            date: true,
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
        date: true, // Added date for completeness
      },
    });

    return NextResponse.json(orderDetails, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { error: "Failed to fetch Order Details." },
      { status: 500 }
    );
  }
}

// POST function to create a new order detail
export async function POST(request: NextRequest) {
  try {
    const formDataArray = await request.json();

    // Validate data format
    if (!Array.isArray(formDataArray)) {
      return NextResponse.json(
        { error: "Invalid data format. Expected an array of order details." },
        { status: 400 }
      );
    }

    // Validate required fields
    const invalidEntry = formDataArray.find(
      (formData) =>
        !formData.order_id || !formData.product_id || !formData.quantity
    );

    if (invalidEntry) {
      return NextResponse.json(
        {
          error: `Missing required fields in entry: ${JSON.stringify(
            invalidEntry
          )}`,
        },
        { status: 400 }
      );
    }

    // Bulk insert order details
    const created = await prisma.order_details.createMany({
      data: formDataArray.map(
        (formData: { order_id: number; product_id: number; quantity: number }) => ({
          order_id: formData.order_id,
          product_id: formData.product_id,
          quantity: formData.quantity,
          date: new Date(),
        })
      ),
    });

    return NextResponse.json(
      { success: true, createdCount: created.count },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order details:", error);
    return NextResponse.json(
      { error: "Failed to create order details." },
      { status: 500 }
    );
  }
}
