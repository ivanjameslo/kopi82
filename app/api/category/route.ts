import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Details model
export async function GET(request: NextRequest) {
  const category = await prisma.category.findMany();
  console.log(category);
  return NextResponse.json(category);
}

// POST function to create a new Purchase Details
export async function POST(request: NextRequest) {
    try {
      const res = await request.json();
      const { category_name } = res;
      const created = await prisma.category.create({
        data: {
          category_name,
        }
      });
      return NextResponse.json(created, { status: 201 });
    } catch (error) {
      console.log("Error creating Category", error);
      return NextResponse.json(error, {status: 500});
  }
  }