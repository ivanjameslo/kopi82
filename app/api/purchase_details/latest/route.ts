import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET function to fetch the latest purchase details for each item
export async function GET(request: NextRequest) {
  try {
    // Fetch the latest purchase details for all items
    const latestPurchaseDetails = await prisma.purchase_details.findMany({
      where: {
        pd_id: {
          in: await prisma.purchase_details.groupBy({
            by: ['item_id'],
            _max: {
              pd_id: true,
            },
          }).then(result => result.map(r => r._max.pd_id).filter((id): id is number => id !== null)), // Filter out null values
        },
      },
      select: {
        pd_id: true,
        po_id: true,
        item_id: true,
        quantity: true,
        unit_id: true,
        price: true,
        expiry_date: true,
      },
    });

    return NextResponse.json(latestPurchaseDetails);
  } catch (error) {
    console.error('Error fetching latest purchase details:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
  }
}