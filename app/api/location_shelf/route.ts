import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Details model
export async function GET(request: NextRequest) {
  const location_shelf = await prisma.location_shelf.findMany();
  console.log(location_shelf);
  return NextResponse.json(location_shelf);
}

// POST function to create a new Purchase Details
export async function POST(request: NextRequest) {
    try {
      const res = await request.json();
      const { ls_name } = res;
      const created = await prisma.location_shelf.create({
        data: {
          ls_name,
        }
      });
      return NextResponse.json(created, { status: 201 });
    } catch (error) {
      console.log("Error creating Location Shelf", error);
      return NextResponse.json(error, {status: 500});
  }
  }