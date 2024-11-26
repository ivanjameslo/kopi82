import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const product_id = params.id;

  if (!product_id || isNaN(Number(product_id))) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const productInventory = await prisma.productInventory.findMany({
      where: { product_id: Number(product_id) },
      include: {
        item: {
          select: {
            item_name: true,
            description: true,
          },
        },
      },
    });

    if (!productInventory || productInventory.length === 0) {
      return NextResponse.json({ error: "No inventory items found for this product" }, { status: 404 });
    }

    const inventoryItems = productInventory.map((inventory) => ({
      item_id: inventory.item_id,
      item_name: inventory.item?.item_name || "Unknown",
      description: inventory.item?.description || "",
      required_quantity: inventory.required_quantity,
    }));

    return NextResponse.json(inventoryItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching product inventory:", error);
    return NextResponse.json({ error: "Failed to fetch product inventory" }, { status: 500 });
  }
}
