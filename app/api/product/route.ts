// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Product model
export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany();
  console.log(products);
  return NextResponse.json(products);
}

// POST function to create a new Product
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { category, product_name, type, price, status } = res;
    const created = await prisma.product.create({
      data: {
        category,
        product_name,
        type,
        price: Number(price),
        status,
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Product", error);
    return NextResponse.json(error, {status: 500});
}
}