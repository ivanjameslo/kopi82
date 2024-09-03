import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Details model
export async function GET(request: NextRequest) {
  const unit = await prisma.unit.findMany();
  console.log(unit);
  return NextResponse.json(unit);
}

// POST function to create a new Purchase Details
export async function POST(request: NextRequest) {
    try {
      const res = await request.json();
      const { unit_name } = res;
      const created = await prisma.unit.create({
        data: {
          unit_name,
        }
      });
      return NextResponse.json(created, { status: 201 });
    } catch (error) {
      console.log("Error creating Unit", error);
      return NextResponse.json(error, {status: 500});
  }
  }