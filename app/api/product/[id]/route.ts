import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

// GET function for fetching a single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  // Ensure the id is a valid number
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        product_id: Number(id),
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PATCH function for updating an existing product
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const product_id = params.id;

  // Ensure the id is a valid number
  if (!product_id || isNaN(Number(product_id))) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
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

// DELETE function for deleting a product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const product_id = params.id;

  // Ensure the id is a valid number
  if (!product_id || isNaN(Number(product_id))) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const product = await prisma.product.delete({
      where: {
        product_id: Number(product_id),
      },
    });
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error deleting product", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
