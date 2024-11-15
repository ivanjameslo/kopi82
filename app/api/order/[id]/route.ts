import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { order_id: parseInt(id, 10) }, // Convert `id` to integer
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
