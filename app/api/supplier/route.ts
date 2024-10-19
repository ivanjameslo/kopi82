import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Supplier model
// export async function GET(request: NextRequest) {
//   try {
//     const suppliers = await prisma.supplier.findMany();
//     return NextResponse.json(suppliers);
//   } catch (error) {
//     console.log("Error fetching suppliers", error);
//     return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
//   }
// }

export async function GET(req: Request) {
  try {
      // Fetch all suppliers and check if they are associated with any purchased_items
      const suppliers = await prisma.supplier.findMany({
          select: {
              supplier_id: true,
              supplier_name: true,
              contact_no: true,
              address: true,
              purchased_item: true, // Assuming "purchased_item" is the related model
          },
      });

      // Modify the data to include isUsed field
      const data = suppliers.map((supplier) => ({
          supplier_id: supplier.supplier_id,
          supplier_name: supplier.supplier_name,
          contact_no: supplier.contact_no,
          address: supplier.address,
          isUsed: supplier.purchased_item.length > 0, // If the supplier is linked to any purchased_items
      }));

      return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
      });
  } catch (error) {
    console.error("Error fetching suppliers with purchased_item:", error); // Log the detailed error
    return new Response(JSON.stringify({ error: "Failed to fetch suppliers." }), {
      status: 500,
      });
  }
}

// POST function to create a new Supplier
export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { supplier_name, contact_no, address } = res;

    // Validate that contact_no is exactly 11 digits (phone numbers should be strings)
    // if (!/^\d{11}$/.test(contact_no)) {
    //   return NextResponse.json({ error: "Invalid contact number, must be exactly 11 digits." }, { status: 400 });
    // }

    // Check if the supplier already exists (case-insensitive comparison for name and address)
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        supplier_name: {
          equals: supplier_name,
          mode: 'insensitive', // Perform a case-insensitive comparison
        },
        address: {
          equals: address,
          mode: 'insensitive', // Perform a case-insensitive comparison
        },
        contact_no: contact_no, // This is now a string comparison
      },
    });

    // If supplier already exists, return an error
    if (existingSupplier) {
      return NextResponse.json({ error: "Supplier already exists" }, { status: 400 });
    }

    // Create the supplier
    const created = await prisma.supplier.create({
      data: {
        supplier_name,
        contact_no,
        address,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("Error creating supplier", error);
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
  }
}
