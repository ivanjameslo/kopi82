import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const backInventoryWithShelves = await prisma.back_inventory.findMany({
      include: {
        inventory_shelf: {
          include: {
            shelf_location: true,
            unit: {
              select: {
                unit_id: true,
                unit_name: true,
              },
            },
          },
        },
        purchased_detail: {
          include: {
            item: {
              include: {
                unit: {
                  select: {
                    unit_id: true,
                    unit_name: true,
                  },
                },
                category: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(backInventoryWithShelves);
  } catch (error) {
    console.error("Error fetching Back Inventory with Shelf Locations:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    // Validate the items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided or invalid format" }, { status: 400 });
    }

    // Validate each item and log errors for missing fields
    const validItems = items.filter(item => {
      if (!item.item_id) console.error("item_id is missing for item", item);
      if (!item.sl_id) console.error("sl_id is missing for item", item);
      if (!item.quantity) console.error("quantity is missing for item", item);
      if (!item.unit_name) console.error("unit_name is missing for item", item);

      // Validate required fields
      return item.item_id && item.sl_id && item.quantity && item.unit_name;
    });

    if (validItems.length !== items.length) {
      return NextResponse.json({ error: "Some items have missing fields (item_id, sl_id, quantity, or unit_name)" }, { status: 400 });
    }

    // Process each item
    for (const item of validItems) {
      // Find or create the unit
      let unitRecord = await prisma.unit.findFirst({
        where: {
          unit_name: {
            equals: item.unit_name,
            mode: 'insensitive'
      }}});

      if (!unitRecord) {
        unitRecord = await prisma.unit.create({
          data: { unit_name: item.unit_name },
        });
      }

      // Update the item's unit_id with the found or created unit's ID
      item.unit_id = unitRecord.unit_id;
    }

    // Create back_inventory entries for the selected items
    const createdBackInventory = await prisma.back_inventory.createMany({
      data: validItems.map(item => ({
        pd_id: item.pd_id,
        item_id: item.item_id,
        stock_in_date: new Date(),
        stock_damaged: item.stock_damaged || 0,
        stock_used: item.stock_used || 0,
        stock_out_date: (item.stock_damaged > 0 || item.stock_used > 0) ? new Date() : null,
      })),
      skipDuplicates: true,
    });

    // Fetch the newly created back_inventory entries to get the bd_id
    const createdRecords = await prisma.back_inventory.findMany({
      where: { pd_id: { in: validItems.map(item => item.pd_id) } },
    });

    // Create inventory_shelf entries
    const inventoryShelfData = validItems.map(item => {
      const correspondingBackInventory = createdRecords.find(
        (record) => record.pd_id === item.pd_id
      );
      if (!correspondingBackInventory) {
        throw new Error(`Back Inventory for item ${item.pd_id} not found`);
      }

      return {
        bd_id: correspondingBackInventory.bd_id,
        sl_id: Number(item.sl_id),
        quantity: item.quantity,
        unit_id: item.unit_id,
      };
    });

    // Insert into the inventory_shelf table
    await prisma.inventory_shelf.createMany({
      data: inventoryShelfData,
    });

    // Track each entry in inventory_tracking
    const inventoryTrackingData = inventoryShelfData.map(entry => ({
      bd_id: entry.bd_id,
      quantity: entry.quantity,
      source_shelf_id: null, // Since this is a new entry, there’s no source shelf
      destination_shelf_id: entry.sl_id,
      unit_id: entry.unit_id,
      date_moved: new Date(),
      action: "added"
    }));

    await prisma.inventory_tracking.createMany({
      data: inventoryTrackingData,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating Back Inventory:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
