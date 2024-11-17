import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        // Fetch all categories and check if they are related to any items
        const discounts = await prisma.discount.findMany({
            select: {
                discount_id: true,
                discount_name: true,
                discount_rate: true,
                status: true,
                payment: true,
            },
        });
  
        // Modify the data to include isUsed field
        const data = discounts.map((discount) => ({
            discount_id: discount.discount_id,
            discount_name: discount.discount_name,
            discount_rate: discount.discount_rate,
            status: discount.status,
            isUsed: Array.isArray(discount.payment) && discount.payment.length > 0, // Ensure payment is an array
        }));
  
        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch discounts." }), {
            status: 500,
        });
    }
  }

  export async function POST(request: NextRequest) {
    try {
        const res = await request.json();
        const { discount_name, discount_rate, status } = res;

        // Validate inputs
        if (!discount_name || typeof discount_name !== 'string') {
            console.error("Invalid discount_name:", discount_name);
            return NextResponse.json({ error: "Invalid Discount Name" }, { status: 400 });
        }

        if (discount_rate == null || typeof discount_rate !== 'number' || discount_rate < 0) {
            console.error("Invalid discount_rate:", discount_rate);
            return NextResponse.json({ error: "Invalid Discount Rate" }, { status: 400 });
        }

        if (status == null || typeof status !== 'string') {
            console.error("Invalid status:", status);
            return NextResponse.json({ error: "Invalid Status" }, { status: 400 });
        }

        // Check for existing discount
        const existingDiscount = await prisma.discount.findFirst({
            where: {
                discount_name: {
                    equals: discount_name,
                    mode: 'insensitive', // Perform a case-insensitive comparison
                },
            },
        });

        // const existingDiscount = await prisma.discount.findFirst({
        //     where: {
        //         AND: [
        //             {
        //                 discount_name: {
        //                     equals: discount_name,
        //                     mode: 'insensitive', // Perform a case-insensitive comparison
        //                 },
        //             },
        //             {
        //                 discount_rate: {
        //                     equals: discount_rate, // Ensure the rate matches exactly
        //                 },
        //             },
        //         ],
        //     },
        // });
        
        if (existingDiscount) {
            return NextResponse.json({ error: "Discount already exists" }, { status: 400 });
        }

        // Create the new discount
        const createdDiscount = await prisma.discount.create({
            data: {
                discount_name,
                discount_rate,
                status,
            },
        });

        return NextResponse.json(createdDiscount, { status: 201 });
    } catch (error) {
        console.error("Error creating Discount:", error);
        return NextResponse.json({ error: "Failed to create Discount" }, { status: 500 });
    }
}
