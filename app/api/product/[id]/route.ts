import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

// PATCH function for updating an existing product
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product_id = params.id;
    const res = await request.json();
    const {
      image_url,
      category,
      product_name,
      type,
      hotPrice,
      icedPrice,
      frappePrice,
      singlePrice,
      status,
      description,
    } = res;

    // Update the product using Prisma
    const updatedProduct = await prisma.product.update({
      where: { product_id: Number(product_id) },
      data: {
        category,
        product_name,
        type,
        hotPrice: Number(hotPrice),
        icedPrice: Number(icedPrice),
        frappePrice: Number(frappePrice),
        singlePrice: Number(singlePrice),
        status,
        description,
        image_url,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
