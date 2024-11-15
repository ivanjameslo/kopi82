import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

// GET function remains unchanged
export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany();
  // console.log(products);
  return NextResponse.json(products);
}

// POST function with Supabase image handling
export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (
      !image_url ||
      !category ||
      !product_name ||
      !status ||
      !description
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Additional URL format validation for image_url
    const urlRegex = new RegExp(
      /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm
    );
    if (!urlRegex.test(image_url)) {
      return NextResponse.json(
        { error: "Invalid URL format for image_url" },
        { status: 400 }
      );
    }

    // Check if product with the same name already exists
    const existingProduct = await prisma.product.findFirst({
      where: { 
        category,
        product_name : {
          equals : product_name,
          mode : 'insensitive',
        },
        hotPrice,
        icedPrice,
        frappePrice,
        singlePrice,
        description : {
          equals : description,
          mode : 'insensitive',
        },
      },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: "Product already exists" },
        { status: 409 }
      );
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

// let image_url = res.image_url;

    // Handle image upload with Supabase
    // if (image) {
    //   const { data, error } = await supabase.storage
    //     .from("ProductImages")
    //     .upload(
    //       `${Date.now()}-${product_name}.png`,
    //       Buffer.from(image.split(",")[1], "base64"),
    //       {
    //         contentType: "image/png",
    //       }
    //     );

    //   if (error) {
    //     console.error("Supabase upload error:", error);
    //     throw new Error("Failed to upload image");
    //   }

    //   const {
    //     data: { publicUrl },
    //   } = supabase.storage.from("ProductImages").getPublicUrl(data.path);

    //   image_url = publicUrl;
    // }