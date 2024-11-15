import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const trackingData = await prisma.inventory_tracking.findMany({
      include: {
        back_inventory: {
          include: {
            purchased_detail: {
              include: {
                item: {
                  select: {
                    item_name: true,
                  },
                },
              },
            },
          },
        },
        source_shelf: {
          select: {
            sl_name: true,
          },
        },
        destination_shelf: {
          select: {
            sl_name: true,
          },
        },
        unit: {
          select: {
            unit_name: true,
          },
        },
      },
      orderBy: {
        date_moved: 'desc',
      },
    });

    // Format the data for frontend use
    const formattedData = trackingData.map((record) => ({
      bd_id: record.back_inventory?.bd_id,
      item_name: record.back_inventory?.purchased_detail?.item?.item_name || "Unnamed Item",
      quantity: record.quantity,
      source_shelf: record.source_shelf?.sl_name || "N/A",
      destination_shelf: record.destination_shelf?.sl_name || "N/A",
      unit_name: record.unit.unit_name,
      date_moved: record.date_moved,
      action: record.action,
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching inventory tracking data:", error);
    return NextResponse.json({ error: "Failed to fetch tracking data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { bd_id, quantity, source_shelf_id, destination_shelf_id, unit_id, action } = body;

        // Log each field to see what's received and if anything is missing
        console.log("Received data for inventory tracking:");
        console.log("bd_id:", bd_id);
        console.log("quantity:", quantity);
        console.log("source_shelf_id:", source_shelf_id);
        console.log("destination_shelf_id:", destination_shelf_id);
        console.log("unit_id:", unit_id);
        console.log("action:", action);

        // Validate the input and log specific errors if any field is missing
        if (!bd_id) console.error("Missing field: bd_id");
        if (!quantity) console.error("Missing field: quantity");
        if (!source_shelf_id) console.error("Missing field: source_shelf_id");
        if (!destination_shelf_id) console.error("Missing field: destination_shelf_id");
        if (!unit_id) console.error("Missing field: unit_id");
        if (!action) console.error("Missing field: action");

        // // Validate the input
        // if (!bd_id || !quantity || !unit_id || !action) {
        //     return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        // }
        // If any required field is missing, return a 400 error with details
        if (!bd_id || !quantity || !unit_id || !action) {
            return NextResponse.json({ error: "Missing required fields", details: { bd_id, quantity, source_shelf_id, destination_shelf_id, unit_id, action } }, { status: 400 });
        }

        // Create a new tracking entry
        const newTrackingEntry = await prisma.inventory_tracking.create({
            data: {
                bd_id,
                quantity,
                source_shelf_id,
                destination_shelf_id,
                unit_id,
                action,
                date_moved: new Date(), // Set current timestamp
            },
        });

        return NextResponse.json(newTrackingEntry, { status: 201 });
    } catch (error) {
        console.error("Error logging inventory movement:", error);
        return NextResponse.json({ error: 'Failed to log movement' }, { status: 500 });
    }
}