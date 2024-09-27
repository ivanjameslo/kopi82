import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

// GET function remains unchanged
export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany();
  console.log(products);
  return NextResponse.json(products);
}

// POST function with Supabase image handling
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const {
      image,
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

    let image_url = res.image_url;

    // Handle image upload with Supabase
    if (image) {
      const { data, error } = await supabase.storage
        .from("ProductImages")
        .upload(
          `${Date.now()}-${product_name}.png`,
          Buffer.from(image.split(",")[1], "base64"),
          {
            contentType: "image/png",
          }
        );

      if (error) {
        console.error("Supabase upload error:", error);
        throw new Error("Failed to upload image");
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("ProductImages").getPublicUrl(data.path);

      image_url = publicUrl;
    }

    // Create product using Prisma
    const created = await prisma.product.create({
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

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Product", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}