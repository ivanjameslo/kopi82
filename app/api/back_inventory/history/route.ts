import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const inventoryHistory = await prisma.back_inventory.findMany({
      include: {
        inventory_shelf: {
          include: {
            shelf_location: true, // Fetch shelf location details
          },
        },
        purchased_detail: {
          include: {
            item: true,  // Fetch item details
          },
        },
      },
    });

    // Map and format the data for display
    const history = inventoryHistory.map((inventory) => ({
      bd_id: inventory.bd_id,
      item_name: inventory.purchased_detail?.item?.item_name ?? 'Unknown Item',
      created_at: inventory.createdAt,
      movements: inventory.inventory_shelf.map((shelf) => ({
        date_moved: shelf.updatedAt, // Assuming this field captures the last movement
        quantity: shelf.quantity,
        from_location: shelf.shelf_location.sl_name, // Source location
        to_location: shelf.shelf_location.sl_name,   // Since we don't have separate from/to fields, use the same location
      })),
    }));

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching inventory history:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
