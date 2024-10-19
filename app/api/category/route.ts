import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from the Purchase Details model
// export async function GET(request: NextRequest) {
//   try {
//     const categories = await prisma.category.findMany();
//     return NextResponse.json(categories);
//   } catch (error) {
//     console.log("Error fetching categories", error);
//     return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
//   }
// }
export async function GET(req: Request) {
  try {
      // Fetch all categories and check if they are related to any items
      const categories = await prisma.category.findMany({
          select: {
              category_id: true,
              category_name: true,
              item: true,
              purchased_detail: true,
          },
      });

      // Modify the data to include isUsed field
      const data = categories.map((category) => ({
          category_id: category.category_id,
          category_name: category.category_name,
          isUsed: 
            category.item.length > 0 ||
            category.purchased_detail.length > 0, // If category has related items, mark it as in use
      }));

      return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
      });
  } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch categories." }), {
          status: 500,
      });
  }
}

// POST function to create a new Category
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { category_name } = res;

    // Validate category_name input
    if (!category_name || typeof category_name !== 'string') {
      console.log("Invalid category_name:", category_name);
      return NextResponse.json({ error: "Invalid Category Name" }, { status: 400 });
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        category_name: {
          equals: category_name,
          mode: 'insensitive', // Perform a case-insensitive comparison
        },
      },
    });

    // Check if a category with the same normalized name exists
    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    // If no existing category, create a new one
    const created = await prisma.category.create({
      data: {
        category_name, // Save the category as it is, without lowering case
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating Category", error);
    return NextResponse.json({ error: "Failed to create Category" }, { status: 500 });
  }
}
