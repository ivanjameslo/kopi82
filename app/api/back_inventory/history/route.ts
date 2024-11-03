import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Fetch back inventory with related movements, items, and shelf locations, ordered by the most recent movement date
    const inventoryHistory = await prisma.back_inventory.findMany({
      include: {
        inventory_shelf: {
          include: {
            shelf_location: {
              select: {
                sl_name: true,
              },
            },
          },
        },
        purchased_detail: {
          include: {
            item: {
              select: {
                item_name: true,
                unit: {
                  select: {
                    unit_name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Order by the most recent entry
      },
    });

    // Map and format the data to include the necessary fields
    const historyData = inventoryHistory.map((record) => ({
      bd_id: record.bd_id,
      item_name: record.purchased_detail?.item?.item_name || "Unknown",
      created_at: record.createdAt,
      movements: record.inventory_shelf.map((shelf) => ({
        date_moved: shelf.updatedAt || "NA", // Assuming you track movement dates
        quantity: shelf.quantity,
        shelf_location: {
          sl_name: shelf.shelf_location.sl_name,
        },
        action: record.stock_used > 0 ? "used" : record.stock_damaged > 0 ? "damaged" : "NA", // Determine stock out action
      })),
      stock_out_date: record.stock_out_date || "NA", // Return stock out date or NA if not applicable
    }));

    return NextResponse.json(historyData, { status: 200 });
  } catch (error) {
    console.error("Error fetching inventory history:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
